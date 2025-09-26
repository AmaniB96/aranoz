<?php

namespace Database\Seeders;

use App\Models\Mail;
use Illuminate\Database\Seeder;

class MailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mails = [
            [
                'name' => 'Jean Dupont',
                'title' => 'Question sur la livraison',
                'message' => 'Bonjour, je voudrais savoir combien de temps prend la livraison pour une commande passée aujourd\'hui. Merci de me répondre rapidement.',
                'archived' => false,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'name' => 'Marie Martin',
                'title' => 'Demande de retour produit',
                'message' => 'Bonjour, j\'ai reçu mon colis hier mais le produit ne correspond pas à ma commande. Je souhaite faire un retour. Pouvez-vous m\'indiquer la procédure à suivre ?',
                'archived' => false,
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
        ];

        foreach ($mails as $mail) {
            Mail::create($mail);
        }
    }
}
