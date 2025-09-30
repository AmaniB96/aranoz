import React from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import '@/Components/Cart/cart.css';

export default function Index() {
    const { items = [], subtotal = 0 } = usePage().props;

    const updateQty = (id, qty) => {
        router.post(`/cart/update/${id}`, { quantity: qty }, { preserveState: true });
    };

    const remove = (id) => {
        router.delete(`/cart/remove/${id}`, {}, { preserveState: true });
    };

    return (
        <div className="cart-page container">
            <h2>Shopping Cart</h2>

            <div className="cart-table">
                <div className="cart-header">
                    <div className="col product">Product</div>
                    <div className="col price">Price</div>
                    <div className="col quantity">Quantity</div>
                    <div className="col total">Total</div>
                </div>

                <div className="cart-body">
                    {items.length === 0 && <div className="empty">Your cart is empty.</div>}
                    {items.map(it => (
                        <div key={it.id} className="cart-row">
                            <div className="col product">
                                <img src={it.image} alt={it.name} onError={e => e.target.src = '/storage/products/default.png'} />
                                <div className="product-meta">
                                    <Link href={`/products/${it.product_id}`}>{it.name}</Link>
                                </div>
                            </div>
                            <div className="col price">
                                <div className="price-val">${it.unit_price}</div>
                            </div>
                            <div className="col quantity">
                                <div className="qty-control">
                                    <button onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))}>−</button>
                                    <input type="text" value={it.quantity} readOnly />
                                    <button onClick={() => updateQty(it.id, it.quantity + 1)}>+</button>
                                </div>
                                <button className="remove-link" onClick={() => remove(it.id)}>Remove</button>
                            </div>
                            <div className="col total">
                                ${it.total}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-footer">
                    <div className="continue">
                        <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
                    </div>

                    <div className="summary">
                        <div className="subtotal">
                            <span>Subtotal</span>
                            <strong>${subtotal}</strong>
                        </div>
                        <div className="actions">
                            <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
                            <button className="btn-primary">Proceed to checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}