import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ShopHeader from '@/Components/Shop/ShopHeader';
import SidebarFilters from '@/Components/Shop/SidebarFilters';
import ProductCard from '@/Components/Shop/ProductCard';
import Pagination from '@/Components/Shop/Pagination';
import '@/Components/Shop/shop.css';
import Footer from '@/Components/Footer/Footer';
import BestSellers from '@/Components/BestSellers/BestSellers';

export default function Shop() {
    const { products, categories, colors, filters, bestSellers = [] } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [localProducts, setLocalProducts] = useState(products.data);

    // ÉCOUTER LES CHANGEMENTS DE LIKES
    useEffect(() => {
        const handleLikeChanged = (event) => {
            const { productId, liked } = event.detail;
            console.log('Like changed:', productId, liked); // DEBUG
            
            // Mettre à jour l'état local des produits
            setLocalProducts(prevProducts => 
                prevProducts.map(p => {
                    if (p.id === productId) {
                        console.log('Updating product:', p.id, 'liked:', liked); // DEBUG
                        return {
                            ...p, 
                            is_liked_by_user: liked,
                            liked_by_users_count: liked 
                                ? p.liked_by_users_count + 1 
                                : p.liked_by_users_count - 1
                        };
                    }
                    return p;
                })
            );
        };

        window.addEventListener('product:like-changed', handleLikeChanged);
        return () => window.removeEventListener('product:like-changed', handleLikeChanged);
    }, []);

    const handleFilter = (query) => {
        router.get('/shop', query, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleFilter({ ...filters, search });
        }
    };

    const handleSearchBlur = () => {
        handleFilter({ ...filters, search });
    };

    return (
        <div>
            <ShopHeader/>
            <main className="shop-page container">
                <div className="search-above">
                    <input 
                        type="text"
                        placeholder="Recherche"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        onBlur={handleSearchBlur}
                        className="search-input-above"
                    />
                    <i className="fa-solid fa-magnifying-glass loupe"></i>
                </div>

                <div className="shop-grid">
                    <aside className="shop-sidebar">
                        <SidebarFilters
                            categories={categories}
                            colors={colors}
                            filters={filters}
                            onFilter={handleFilter}
                            showSearch={false}
                        />
                    </aside>

                    <section className="shop-content">
                        <div className="products-grid">
                            {localProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <Pagination products={products} />
                    </section>
                </div>
                <BestSellers products={bestSellers} />
            </main>
            <Footer/>
        </div>
    );
}