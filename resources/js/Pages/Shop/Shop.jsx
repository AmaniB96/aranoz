import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ShopHeader from '@/Components/Shop/ShopHeader';
import SidebarFilters from '@/Components/Shop/SidebarFilters';
import ProductCard from '@/Components/Shop/ProductCard';
import Pagination from '@/Components/Shop/Pagination';
import '@/Components/Shop/shop.css';
import Footer from '@/Components/Footer/Footer';

export default function Shop() {
    const { products, categories, colors, filters } = usePage().props;

    const handleFilter = (query) => {
        Inertia.get(route('shop'), query, { preserveState: true, replace: true });
    };

    return (
        <div>
            <ShopHeader/>
            <main className="shop-page container">
                <div className="shop-grid">
                    <aside className="shop-sidebar">
                        <SidebarFilters
                            categories={categories}
                            colors={colors}
                            filters={filters}
                            onFilter={handleFilter}
                        />
                    </aside>

                    <section className="shop-content">
                        <div className="products-grid">
                            {products.data.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>

                        <Pagination meta={products.meta} links={products.links} />
                    </section>
                </div>
            </main>
            <Footer/>
        </div>
    );
}