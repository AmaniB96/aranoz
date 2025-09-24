<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ordre important : tables de base d'abord, puis dépendances
        $this->call([
            RoleSeeder::class,           // Rôles
            UserSeeder::class,           // Utilisateurs (dépend de roles)
            AdressSeeder::class,         // Adresses (dépend de users)
            ProductCategorySeeder::class, // Catégories produits
            ColorSeeder::class,          // Couleurs
            PromoSeeder::class,          // Promos
            ProductSeeder::class,        // Produits (dépend de categories, colors, promos)
            ProductDetailSeeder::class,  // Détails produits (dépend de products)
            BlogCategorySeeder::class,   // Catégories blogs
            TagSeeder::class,            // Tags
            BlogSeeder::class,           // Blogs (dépend de categories, users)
            BlogTagSeeder::class,        // Pivot blogs-tags (dépend de blogs, tags)
            BlogCommentSeeder::class,    // Commentaires blogs (dépend de blogs, users)
            LikedProductSeeder::class,   // Likes (dépend de users, products)
            CartSeeder::class,           // Paniers (dépend de users)
            CartProductSeeder::class,    // Produits paniers (dépend de carts, products)
            OrderSeeder::class,          // Commandes (dépend de carts)
            MailSeeder::class,           // Mails (si nécessaire)
            ContactSeeder::class
        ]);
    }
}
