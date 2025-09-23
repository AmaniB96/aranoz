import React, { useState } from 'react';
import './carousel.css';
import Nav from '../nav/Nav';

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Chaise Moderne",
            description: "Chaise très moderne, fabriquée avec des matériaux recyclés issus des déchèteries locale",
            image: "/storage/products/carousel/product_1.png",
            slideNumber: "01"
        },
        {
            id: 2,
            title: "Fauteuil Confort",
            description: "Un fauteuil alliant confort et design moderne pour votre salon",
            image: "/storage/products/carousel/product_2.png",
            slideNumber: "02"
        },
        {
            id: 3,
            title: "Table Design",
            description: "Table au design épuré, parfaite pour votre espace de vie",
            image: "/storage/products/carousel/product_3.png",
            slideNumber: "03"
        },
        {
            id: 4,
            title: "Lampe Élégante",
            description: "Éclairage moderne et élégant pour sublimer votre intérieur",
            image: "/storage/products/carousel/product_4.png",
            slideNumber: "04"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="carousel-container">
            <Nav/>

            <div className="carousel-content">
                <div className="slide-content">
                    <div className="slide-text">
                        <h1>{slides[currentSlide].title}</h1>
                        <p>{slides[currentSlide].description}</p>
                    </div>
                    <div className="slide-image">
                        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
                        <div className="slide-number">{slides[currentSlide].slideNumber}</div>
                    </div>
                </div>

                <div className="carousel-controls">
                    <button className="carousel-btn prev" onClick={prevSlide}>
                        Previous
                    </button>
                    <span className="separator">|</span>
                    <button className="carousel-btn next" onClick={nextSlide}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}