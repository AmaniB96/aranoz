import React, { useState } from 'react';

export default function SidebarFilters({ categories = [], colors = [], filters = {}, onFilter, showSearch = true }) {
    const [state, setState] = useState({
        category: filters.category || '',
        color: filters.color || '',
        search: filters.search || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        sort: filters.sort || '',
    });

    const [isOpen, setIsOpen] = useState(false);

    const updateState = (key, value) => {
        const newState = { ...state, [key]: value };
        setState(newState);
        // Apply filters immediately for category, color, sort
        if (['category', 'color', 'sort'].includes(key)) {
            onFilter(newState);
        }
    };

    const handlePriceChange = (key, value) => {
        const newState = { ...state, [key]: value };
        setState(newState);
        // Apply filters immediately for price changes
        onFilter(newState);
    };

    const handleReset = () => {
        const resetState = { category:'',color:'',search:'',min_price:'',max_price:'',sort:'' };
        setState(resetState);
        onFilter(resetState);
    };

    const toggleFilters = () => {
        setIsOpen(!isOpen);
    };

    const closeFilters = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Filters Toggle Button */}
            <button className="mobile-filters-toggle" onClick={toggleFilters}>
                <i className="fas fa-filter"></i> Filters
            </button>

            {/* Overlay for mobile */}
            <div className={`filters-overlay ${isOpen ? 'open' : ''}`} onClick={closeFilters}></div>

            {/* Sidebar Filters */}
            <div className={`sidebar-filters ${isOpen ? 'open' : ''}`}>
                {/* Close button for mobile */}
                <button className="filters-close-btn" onClick={closeFilters} style={{display: 'none'}}>
                    <i className="fas fa-times"></i> Close Filters
                </button>

                <div className="filter-block">
                    <h4>Product filters</h4>
                    <ul className="category-list">
                        {categories.map(c => (
                            <li key={c.id}>
                                <button 
                                    type="button" 
                                    className={state.category == c.id ? 'active' : ''}
                                    onClick={() => updateState('category', state.category == c.id ? '' : c.id)}
                                >
                                    {c.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="filter-block">
                    <h4 className='color-filter'>Color Filter</h4>
                    <ul className="color-list">
                        {colors.map(c => (
                            <li key={c.id}>
                                <button 
                                    type="button" 
                                    className={state.color == c.id ? 'active' : ''}
                                    onClick={() => updateState('color', state.color == c.id ? '' : c.id)}
                                >
                                    {c.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="filter-actions">
                    <button 
                        type="button" 
                        onClick={handleReset}
                    >
                        <b>Reset</b>
                    </button>
                </div>
            </div>
        </>
    );
}