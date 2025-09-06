import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../Context/MainContext';
import { useSelector } from 'react-redux';

const ThankYou = () => {
    const user = useSelector(store => store.user);
    const { order_id } = useParams();
    const { API_BASE_URL, CART_ORDER_URL, productImageUrl } = useContext(Context);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (order_id) {
            axios.get(`${API_BASE_URL}${CART_ORDER_URL}/${order_id}`)
                .then((success) => {
                    if (success.data.status === 1) {
                        setOrder(success.data.order);
                    }
                })
                .catch((err) => console.error("Failed to fetch order:", err));
        }
    }, [order_id]);

    if (!order) {
        return <div className="text-center p-10">Loading your order details...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <div>
                            <h1 className="text-xl font-bold text-gray-500">Order #{order._id}</h1>
                            <h2 className="text-2xl md:text-3xl font-bold">Thank You, {user.data?.name || 'Guest'}!</h2>
                        </div>
                    </div>
                    <img src="/image/logo.svg.svg" alt="iShop Logo" className='h-10 mt-4 sm:mt-0' />
                </div>
                <div className="border-t border-b py-6 my-6">
                    <h3 className="text-lg font-semibold">Your order is confirmed</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        We've accepted your order and are getting it ready. A confirmation has been sent to {order.shipping_details?.email}.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold mb-4">Customer Details</h4>
                        <div className="text-sm space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col"><span className="font-medium">Email</span><span>{order.shipping_details?.email}</span></div>
                                <div className="flex flex-col"><span className="font-medium">Phone</span><span>{order.shipping_details?.phone}</span></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col"><span className="font-medium">Billing address</span><span>{order.shipping_details?.first_name} {order.shipping_details?.last_name}</span><span>{order.shipping_details?.Street}, {order.shipping_details?.Locality}</span><span>{order.shipping_details?.City}, {order.shipping_details?.State} {order.shipping_details?.pin}</span></div>
                                <div className="flex flex-col"><span className="font-medium">Shipping address</span><span>{order.shipping_details?.first_name} {order.shipping_details?.last_name}</span><span>{order.shipping_details?.Street}, {order.shipping_details?.Locality}</span><span>{order.shipping_details?.City}, {order.shipping_details?.State} {order.shipping_details?.pin}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold mb-4">Order Summary</h4>
                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                            {order.product_details?.map((item) => (
                                <div key={item.pId} className="flex justify-between items-center text-sm">
                                    <div className='flex items-center gap-3'>
                                        <img src={API_BASE_URL + productImageUrl + item.image} className="w-12 h-12 rounded-md object-cover" alt={item.name} />
                                        <div>
                                            <p className='font-medium'>{item.name}</p>
                                            <p className='text-gray-600'>Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                    <span>₹{(item.discount_price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.order_total.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{order.order_total.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThankYou;