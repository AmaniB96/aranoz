<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;

class ImageService
{
    private ImageManager $imageManager;

    private const SIZES = [
        'card' => ['width' => 300, 'height' => 300],
        'carousel' => ['width' => 600, 'height' => 400],
        'panier' => ['width' => 400, 'height' => 400],
        'show' => ['width' => 800, 'height' => 600],
    ];

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Process uploaded images or URLs for a product
     *
     * @param array $imageData Array with 'front', 'left', 'right', 'bonus' keys containing UploadedFile or URL strings
     * @param string|null $existingImageName Base name for existing images (for updates)
     * @return array Array with image paths for each position and size
     */
    public function processProductImages(array $imageData, ?string $existingImageName = null): array
    {
        $result = [
            'image_front' => null,
            'image_left' => null,
            'image_right' => null,
            'image_bonus' => null,
        ];

        $positions = ['front', 'left', 'right', 'bonus'];

        foreach ($positions as $position) {
            $input = $imageData[$position] ?? null;

            if ($input instanceof UploadedFile) {
                // Handle file upload
                $result["image_{$position}"] = $this->processUploadedFile($input, $position, $existingImageName);
            } elseif (is_string($input) && !empty($input)) {
                // Handle URL
                $result["image_{$position}"] = $this->processImageUrl($input, $position, $existingImageName);
            } elseif ($existingImageName) {
                // Keep existing image if no new input provided
                $result["image_{$position}"] = $existingImageName;
            }
        }

        return $result;
    }

    /**
     * Process an uploaded file
     */
    private function processUploadedFile(UploadedFile $file, string $position, ?string $existingImageName = null): string
    {
        // Generate unique filename if not updating existing
        $imageName = $existingImageName ?: Str::uuid()->toString();

        // Create Intervention Image instance
        $image = $this->imageManager->read($file);

        // Process each size
        foreach (self::SIZES as $sizeName => $dimensions) {
            $resizedImage = clone $image;

            // Resize maintaining aspect ratio
            $resizedImage->scale($dimensions['width'], $dimensions['height']);

            // Save to storage
            $path = "products/{$sizeName}/{$imageName}.jpg";
            Storage::disk('public')->put($path, $resizedImage->toJpeg());
        }

        return $imageName;
    }

    /**
     * Process an image URL
     */
    private function processImageUrl(string $url, string $position, ?string $existingImageName = null): string
    {
        try {
            // Generate unique filename if not updating existing
            $imageName = $existingImageName ?: Str::uuid()->toString();

            // Create Intervention Image instance from URL
            $image = $this->imageManager->read($url);

            // Process each size
            foreach (self::SIZES as $sizeName => $dimensions) {
                $resizedImage = clone $image;

                // Resize maintaining aspect ratio
                $resizedImage->scale($dimensions['width'], $dimensions['height']);

                // Save to storage
                $path = "products/{$sizeName}/{$imageName}.jpg";
                Storage::disk('public')->put($path, $resizedImage->toJpeg());
            }

            return $imageName;
        } catch (\Exception $e) {
            // If URL processing fails, return the URL as-is for backward compatibility
            return $url;
        }
    }

    /**
     * Delete product images
     */
    public function deleteProductImages(string $imageName): void
    {
        foreach (self::SIZES as $sizeName => $dimensions) {
            $path = "products/{$sizeName}/{$imageName}.jpg";
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Get image URL for specific size and position
     */
    public static function getImageUrl(string $imageName, string $size, string $position = 'front'): string
    {
        if (filter_var($imageName, FILTER_VALIDATE_URL)) {
            // If it's already a URL, return as-is
            return $imageName;
        }

        return asset("storage/products/{$size}/{$imageName}.jpg");
    }

    /**
     * Check if image exists for specific size
     */
    public static function imageExists(string $imageName, string $size): bool
    {
        if (filter_var($imageName, FILTER_VALIDATE_URL)) {
            return true; // URLs are considered to exist
        }

        $path = "products/{$size}/{$imageName}.jpg";
        return Storage::disk('public')->exists($path);
    }
}