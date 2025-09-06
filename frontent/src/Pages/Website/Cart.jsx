import React, { useContext, useEffect } from 'react';
import { BsBagCheckFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosCloseCircle } from "react-icons/io";
import { Context } from '../../Context/MainContext';
import { changeCartQty, removeFromCart } from '../../Reducers/cartSlice';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const user = useSelector(store => store.user);
    const cart = useSelector(store => store.cart);
    const navigator = useNavigate();
    const dispatcher = useDispatch();
    const { products, productImageUrl, API_BASE_URL, fetchProduct, CART_BASE_URL } = useContext(Context);

    useEffect(() => {
        fetchProduct();
    }, []);

    const cartProduct = products
        .map(p => {
            const cartItem = cart.data.find(c => c.pId === p._id);
            return cartItem ? { ...cartItem, ...p } : null;
        })
        .filter(item => item !== null);

    const updateDbCart = (pId, newQty) => {
        if (user.data != null && newQty > 0) {
            axios.put(`${API_BASE_URL}${CART_BASE_URL}/change-quantity`, {
                user_id: user.data._id, pId, newQty
            });
        }
    };

    const removeFromDbCart = (pId) => {
        if (user.data != null) {
            axios.post(`${API_BASE_URL}${CART_BASE_URL}/remove-from-cart`, {
                user_id: user.data._id, pId
            });
        }
    };

    const handleRemoveFromCart = (pro) => {
        dispatcher(removeFromCart({
            pId: pro._id,
            total_price: pro.discount_price * pro.qty
        }));
        removeFromDbCart(pro._id);
    };

    const handleChangeQty = (pro, flag) => {
        const newQty = flag ? pro.qty + 1 : pro.qty - 1;
        if (newQty === 0) {
            handleRemoveFromCart(pro);
        } else {
            dispatcher(changeCartQty({
                pId: pro._id,
                flag: flag,
                price: pro.discount_price
            }));
            updateDbCart(pro._id, newQty);
        }
    };

    const checkout = () => {
        navigator(user.data == null ? "/login" : "/checkout");
    };

    if (cart.data.length === 0) {
        return (
            <div className='flex items-center justify-center py-20 text-center px-4'>
                <div>
                    <img src="/image/pngwing.com.png" alt="Empty Cart" width={280} className='mx-auto mb-6' />
                    <h2 className="text-4xl font-bold mb-2">Your Cart is Empty</h2>
                    <p className="text-black mb-4 text-lg">Looks like you haven't added any items yet.</p>
                    <Link to="/" className="bg-yellow-500 text-gray-800 py-3 px-6 rounded-md hover:bg-yellow-600 transition-transform">
                        Explore Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 p-4 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">Shopping Bag <BsBagCheckFill /></h1>
                    <p className="text-sm text-gray-600">{cart.data?.length} items in your bag.</p>

                    {/* Cart Items List for Mobile */}
                    <div className="lg:hidden mt-6 space-y-4">
                        {cartProduct.map((pro) => (
                            <div key={pro._id} className="flex gap-4 border-b pb-4">
                                <img src={API_BASE_URL + productImageUrl + pro.image} alt={pro.name} className='w-24 h-24 object-cover rounded-md' />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{pro.name}</p>
                                                <p className="text-xs text-gray-500">{pro.category_id.name} · {pro.color.name}</p>
                                            </div>
                                            <IoIosCloseCircle onClick={() => handleRemoveFromCart(pro)} className='text-2xl text-red-600 cursor-pointer' />
                                        </div>
                                        <p className='mt-1 font-bold'>₹ {pro.discount_price}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => handleChangeQty(pro, false)} className="border rounded-md px-3 py-1">-</button>
                                            <span>{pro.qty}</span>
                                            <button onClick={() => handleChangeQty(pro, true)} className="border rounded-md px-3 py-1">+</button>
                                        </div>
                                        <p className='font-bold text-lg'>₹ {pro.discount_price * pro.qty}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Items Table for Desktop */}
                    <table className="hidden lg:table w-full text-sm text-left mt-4">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Quantity</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartProduct.map((pro) => (
                                <tr key={pro._id} className="border-b">
                                    <td className="px-4 py-4 flex items-center gap-3">
                                        <img src={API_BASE_URL + productImageUrl + pro.image} alt={pro.name} className='w-20 h-20 object-cover rounded-md' />
                                        <div>
                                            <p className="font-semibold">{pro.name}</p>
                                            <p className="text-xs text-gray-500">{pro.category_id.name} · {pro.color.name}</p>
                                        </div>
                                    </td>
                                    <td className='px-4 py-4'>₹ {pro.discount_price}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleChangeQty(pro, false)} className="border rounded-md px-3 py-1">-</button>
                                            <span>{pro.qty}</span>
                                            <button onClick={() => handleChangeQty(pro, true)} className="border rounded-md px-3 py-1">+</button>
                                        </div>
                                    </td>
                                    <td className='px-4 py-4'>₹ {pro.discount_price * pro.qty}</td>
                                    <td className='px-4 py-4'>
                                        <IoIosCloseCircle onClick={() => handleRemoveFromCart(pro)} className='text-2xl text-red-600 cursor-pointer' />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-96">
                    <div className="bg-yellow-200 p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Cart Total</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between"><p>Subtotal</p><p>₹ {cart.total}</p></div>
                            <div className="flex justify-between"><p>Shipping</p><p>Free</p></div>
                            <div className="flex justify-between"><p>Discount</p><p>₹ 0.00</p></div>
                            <hr className="my-2 border-gray-400" />
                            <div className="flex justify-between font-bold text-lg"><p>Total</p><p>₹ {cart.total}</p></div>
                        </div>
                        <button onClick={checkout} className="w-full mt-6 bg-slate-800 text-white py-3 rounded-md hover:bg-slate-700 transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;