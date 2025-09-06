import React, { useContext } from 'react';
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { Context } from '../../Context/MainContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Reducers/cartSlice';
import axios from 'axios';

const ProductBox = ({ _id, name, image, price, discount_percent, discount_price, rating = 4 }) => {
    const { productImageUrl, API_BASE_URL, CART_BASE_URL } = useContext(Context);
    const dispatcher = useDispatch();
    const user = useSelector(store => store.user);

    const addToDbCart = (pId) => {
        if (user.data != null) {
            axios.post(`${API_BASE_URL}${CART_BASE_URL}/add-to-cart`, { 
                user_id: user.data._id, 
                pId: pId, 
                qty: 1 
            });
        }
    };

    const handleAddToCart = () => {
        dispatcher(addToCart({ price: discount_price, pId: _id, qty: 1 }));
        addToDbCart(_id);
    };

    return (
        <div className="group relative flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden">
                <img 
                    src={API_BASE_URL + productImageUrl + image} 
                    className='w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105' 
                    alt={name}
                />
            </div>
            
            <div className='p-4 flex flex-col flex-grow'>
                <h3 className='font-semibold text-gray-800 text-lg truncate'>{name}</h3>
                
                <div className="my-3">
                    <Stars yellow={rating} />
                </div>

                <div className="mt-auto">
                    {discount_percent > 0 ? (
                        <div className='flex items-baseline gap-3'>
                            <span className='text-2xl font-bold text-red-600'>₹{discount_price}</span>
                            <span className='text-md text-gray-500 line-through'>₹{price}</span>
                        </div>
                    ) : (
                        <span className='text-2xl font-bold text-gray-800'>₹{discount_price}</span>
                    )}
                </div>
            </div>

            <button 
                onClick={handleAddToCart}
                className='flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold py-3 transition-all duration-300 transform translate-y-full group-hover:translate-y-0'
            >
                <FaShoppingCart />
                Add To Cart
            </button>
        </div>
    );
}

function Stars({ yellow }) {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} className={i < yellow ? 'text-yellow-400' : 'text-gray-300'} />
    ));
    return <div className='text-lg flex gap-1'>{stars}</div>;
}

export default ProductBox;