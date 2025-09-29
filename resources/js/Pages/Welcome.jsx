import React from 'react';
import Carousel from '@/Components/carousel/Carousel';
import FeaturedCategory from '@/Components/FeaturedCategory/FeaturedCategory';
import AwesomeSection from '@/Components/AwesomeSection/AwesomeSection';
import WeeklySale from '@/Components/WeeklySale/WeeklySale';
import BestSellers from '@/Components/BestSellers/BestSellers';
import Newsletter from '@/Components/Newsletter/Newsletter';
import Footer from '@/Components/Footer/Footer';
// import './welcome.css';

export default function Welcome({ 
    carouselProducts, 
    categories, 
    products, 
    weeklyProduct, 
    bestSellers,
    discountedProducts 
}) {
    return (
        <div className="welcome-container">
            <Carousel products={carouselProducts} />
            <FeaturedCategory categories={categories} />
            <AwesomeSection products={products} />
            <WeeklySale product={weeklyProduct} />
            <BestSellers products={bestSellers} />
            <Newsletter discountedProducts={discountedProducts} />
            <Footer />
        </div>
    );
}