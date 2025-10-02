import React, { useState } from 'react';
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
                            {products.data.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>

                        <Pagination meta={products.meta} links={products.links} />
                    </section>
                </div>
                <BestSellers products={bestSellers} />
            </main>
            <Footer/>
        </div>
    );
}