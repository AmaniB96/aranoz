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

    return (
        <div className="sidebar-filters">
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

            {/* {showSearch && (
                <div className="filter-block">
                    <input 
                        placeholder="Recherche" 
                        value={state.search}
                        onChange={e => setState(prev => ({ ...prev, search: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') onFilter(state); }}
                        onBlur={() => onFilter(state)}
                    />
                </div>
            )} */}

            {/* <div className="filter-block price-range">
                <input 
                    placeholder="Min" 
                    value={state.min_price} 
                    onChange={e => handlePriceChange('min_price', e.target.value)} 
                />
                <input 
                    placeholder="Max" 
                    value={state.max_price} 
                    onChange={e => handlePriceChange('max_price', e.target.value)} 
                />
            </div> */}
{/* 
            <div className="filter-block">
                <select 
                    value={state.sort || ''} 
                    onChange={e => updateState('sort', e.target.value)}
                >
                    <option value="">Sort By</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                </select>
            </div> */}

            <div className="filter-actions">
                <button 
                    type="button" 
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}