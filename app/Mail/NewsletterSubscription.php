<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;
use Symfony\Component\Mime\Email as SymfonyEmail;

class NewsletterSubscription extends Mailable
{
    use Queueable, SerializesModels;

    public array $products;

    /**
     * Create a new message instance.
     */
    public function __construct(array $products)
    {
        // $products doivent déjà contenir: id, name, prices, discount_percent, image_path
        $this->products = $products;
    }

    public function build()
    {
        $prepared = [];

        foreach ($this->products as $product) {
            $product['image_cid'] = null;

            if (!empty($product['image_path']) && file_exists($product['image_path'])) {
                // Générer un CID unique
                $cid = 'img_' . $product['id'] . '_' . Str::random(8) . '@aranoz.local';
                $product['image_cid'] = 'cid:' . $cid;

                // LOG POUR VÉRIFIER
                \Log::info('Embedding image for product', [
                    'product_id' => $product['id'],
                    'cid' => $cid,
                    'path' => $product['image_path'],
                ]);
            } else {
                \Log::warning('No image to embed for product', [
                    'product_id' => $product['id'],
                    'path' => $product['image_path'] ?? 'null',
                ]);
            }

            $prepared[] = $product;
        }

        return $this->subject('🎉 Exclusive Discounts Just For You - Aranoz')
            ->view('emails.newsletter-subscription', [
                'products' => $prepared,
            ])
            ->withSymfonyMessage(function (SymfonyEmail $message) use ($prepared) {
                foreach ($prepared as $product) {
                    if (!empty($product['image_cid']) && !empty($product['image_path'])) {
                        $cid = str_replace('cid:', '', $product['image_cid']);
                        
                        try {
                            // EMBEDDING GARANTI
                            $message->embedFromPath($product['image_path'], $cid);
                            
                            \Log::info('Image embedded successfully', [
                                'product_id' => $product['id'],
                                'cid' => $cid,
                            ]);
                        } catch (\Exception $e) {
                            \Log::error('Failed to embed image', [
                                'product_id' => $product['id'],
                                'cid' => $cid,
                                'path' => $product['image_path'],
                                'error' => $e->getMessage(),
                            ]);
                        }
                    }
                }
            });
    }
}