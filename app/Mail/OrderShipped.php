<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $items;
    public $total;
    public $subtotal;
    public $discount;
    public $couponCode;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order, $items, $total, $subtotal = null, $discount = null, $couponCode = null)
    {
        $this->order = $order;
        $this->items = $items;
        $this->total = $total;
        $this->subtotal = $subtotal ?? $order->subtotal;
        $this->discount = $discount ?? $order->discount_amount;
        $this->couponCode = $couponCode ?? $order->coupon_code;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Order #' . $this->order->order_number . ' Has Been Shipped!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.order-shipped',
            with: [
                'order' => $this->order,
                'items' => $this->items,
                'total' => $this->total,
                'subtotal' => $this->subtotal,
                'discount' => $this->discount,
                'couponCode' => $this->couponCode,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}