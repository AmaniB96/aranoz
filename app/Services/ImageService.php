<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    public function processProductImages($imageData, $existingImageName = null)
    {
        $processedImages = [];

        \Log::info('Processing image data:', $imageData);

        foreach ($imageData as $position => $data) {
            $fieldName = "image_{$position}";
            
            \Log::info("Processing {$position}:", ['data' => $data, 'type' => gettype($data)]);
            
            if ($data instanceof UploadedFile) {
                \Log::info("Uploading file for {$position}");
                $filename = $this->uploadProductImage($data);
                if ($filename) {
                    $processedImages[$fieldName] = $filename;
                    \Log::info("Uploaded {$position} as: {$filename}");
                } else {
                    \Log::error("Failed to upload {$position}");
                    // CRITIQUE : Si c'est image_front, on DOIT avoir une image !
                    if ($position === 'front') {
                        throw new \Exception("Failed to upload main product image (image_front). Upload is mandatory.");
                    }
                }
            } elseif (is_string($data) && filter_var($data, FILTER_VALIDATE_URL)) {
                \Log::info("Downloading URL for {$position}: {$data}");
                $filename = $this->downloadImageFromUrl($data);
                if ($filename) {
                    $processedImages[$fieldName] = $filename;
                    \Log::info("Downloaded {$position} as: {$filename}");
                } else {
                    \Log::error("Failed to download {$position}");
                    if ($position === 'front') {
                        throw new \Exception("Failed to download main product image (image_front). Upload is mandatory.");
                    }
                }
            } else {
                \Log::info("No valid data for {$position}");
            }
        }

        // VÉRIFICATION FINALE : image_front DOIT exister
        if (!isset($processedImages['image_front'])) {
            throw new \Exception("Main product image (image_front) is required but was not uploaded successfully.");
        }

        \Log::info('Final processed images:', $processedImages);
        return $processedImages;
    }

    private function uploadProductImage(UploadedFile $file)
    {
        try {
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            
            \Log::info("=== UPLOAD START ===");
            \Log::info("Filename: {$filename}");
            \Log::info("Original name: " . $file->getClientOriginalName());
            \Log::info("Size: " . $file->getSize() . " bytes");
            \Log::info("Mime type: " . $file->getMimeType());
            \Log::info("Temp path: " . $file->getRealPath());
            
            // MÉTHODE 1 : move() - Plus fiable sur Windows
            $destinationPath = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'products');
            
            // Créer le dossier s'il n'existe pas
            if (!is_dir($destinationPath)) {
                \Log::info("Creating directory: {$destinationPath}");
                if (!mkdir($destinationPath, 0755, true)) {
                    throw new \Exception("Failed to create directory: {$destinationPath}");
                }
            }
            
            // Vérifier que le dossier est accessible en écriture
            if (!is_writable($destinationPath)) {
                throw new \Exception("Directory is not writable: {$destinationPath}");
            }
            
            \Log::info("Moving file to: {$destinationPath}");
            
            // Déplacer le fichier
            $moved = $file->move($destinationPath, $filename);
            
            if (!$moved) {
                throw new \Exception("File move operation failed");
            }
            
            $fullPath = $destinationPath . DIRECTORY_SEPARATOR . $filename;
            
            // Vérifier que le fichier existe réellement
            if (!file_exists($fullPath)) {
                throw new \Exception("FILE NOT FOUND AFTER MOVE: {$fullPath}");
            }
            
            $fileSize = filesize($fullPath);
            if ($fileSize === 0) {
                throw new \Exception("File saved but size is 0 bytes: {$fullPath}");
            }
            
            \Log::info("✅✅✅ FILE SAVED SUCCESSFULLY: {$fullPath}");
            \Log::info("✅ File size: {$fileSize} bytes");
            
            // Copier vers les sous-dossiers
            $this->copyToSubFolders($filename);
            
            \Log::info("=== UPLOAD END ===");
            
            return $filename;
            
        } catch (\Exception $e) {
            \Log::error('❌❌❌ UPLOAD FAILED: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e; // RELANCER l'exception pour stopper la création du produit
        }
    }

    private function downloadImageFromUrl($url)
    {
        try {
            \Log::info("Downloading image from URL: {$url}");
            
            $imageContent = file_get_contents($url);
            if ($imageContent === false) {
                throw new \Exception("Failed to download image from URL");
            }

            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
            if (!$extension) {
                $extension = 'jpg';
            }

            $filename = time() . '_' . Str::random(10) . '.' . $extension;
            $destinationPath = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'products');
            
            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            $fullPath = $destinationPath . DIRECTORY_SEPARATOR . $filename;
            
            if (file_put_contents($fullPath, $imageContent) === false) {
                throw new \Exception("Failed to save downloaded image");
            }
            
            if (!file_exists($fullPath) || filesize($fullPath) === 0) {
                throw new \Exception("Downloaded image file is invalid");
            }
            
            \Log::info("✅ Image downloaded successfully: {$fullPath}");
            
            $this->copyToSubFolders($filename);
            
            return $filename;
            
        } catch (\Exception $e) {
            \Log::error('Failed to download image from URL: ' . $url, ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    private function copyToSubFolders($filename)
    {
        $sourcePath = storage_path("app" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "products" . DIRECTORY_SEPARATOR . $filename);
        
        \Log::info("Copying image from: {$sourcePath}");
        
        if (!file_exists($sourcePath)) {
            throw new \Exception("Source image NOT FOUND for copy: {$sourcePath}");
        }
        
        $sourceSize = filesize($sourcePath);
        \Log::info("Source image size: {$sourceSize} bytes");
        
        $subFolders = ['card', 'show', 'carousel', 'panier'];
        
        foreach ($subFolders as $folder) {
            $targetDir = storage_path("app" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "products" . DIRECTORY_SEPARATOR . $folder);
            $targetPath = $targetDir . DIRECTORY_SEPARATOR . $filename;
            
            // Créer le dossier s'il n'existe pas
            if (!is_dir($targetDir)) {
                \Log::info("Creating directory: {$targetDir}");
                if (!mkdir($targetDir, 0755, true)) {
                    throw new \Exception("Failed to create directory: {$targetDir}");
                }
            }
            
            // Copier le fichier
            if (!copy($sourcePath, $targetPath)) {
                throw new \Exception("Failed to copy image to: {$targetPath}");
            }
            
            // Vérifier la copie
            if (!file_exists($targetPath)) {
                throw new \Exception("Copy succeeded but file not found: {$targetPath}");
            }
            
            $targetSize = filesize($targetPath);
            if ($targetSize !== $sourceSize) {
                throw new \Exception("Copied file size mismatch: {$targetPath} (expected {$sourceSize}, got {$targetSize})");
            }
            
            \Log::info("✅✅ Successfully copied to: {$targetPath} ({$targetSize} bytes)");
        }
    }

    public function deleteProductImages($filename)
    {
        if (!$filename) return;

        $paths = [
            "public/products/{$filename}",
            "public/products/card/{$filename}",
            "public/products/carousel/{$filename}",
            "public/products/panier/{$filename}",
            "public/products/show/{$filename}"
        ];

        foreach ($paths as $path) {
            if (Storage::exists($path)) {
                Storage::delete($path);
            }
        }
    }

    public function verifyImageAccess($filename, $folder = 'card')
    {
        if (!$filename) return false;
        $path = storage_path("app" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "products" . DIRECTORY_SEPARATOR . $folder . DIRECTORY_SEPARATOR . $filename);
        return file_exists($path);
    }
}