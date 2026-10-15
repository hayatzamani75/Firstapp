<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewOrderPlaced extends Notification
{
    use Queueable;

    public function __construct(
        public int $orderId,
        public string $customerName,
        public string $total,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_order',
            'order_id' => $this->orderId,
            'customer_name' => $this->customerName,
            'total' => $this->total,
            'message' => "{$this->customerName} placed order #{$this->orderId}.",
        ];
    }
}
