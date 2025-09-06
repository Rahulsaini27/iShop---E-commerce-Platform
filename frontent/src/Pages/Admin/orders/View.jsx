import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../../../Context/MainContext';
import { useSelector } from 'react-redux';

const ViewOrders = () => {
    const { API_BASE_URL, openToast } = useContext(Context);
    const { token } = useSelector(store => store.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    // Remove the headers object from the axios call
    axios.get(`${API_BASE_URL}/admin/orders`)
    .then(response => {
        if (response.data.status === 1) {
            setOrders(response.data.orders);
        } else {
            openToast(response.data.msg, 'error');
        }
        setLoading(false);
    })
    .catch(error => {
        openToast(error.response?.data?.msg || 'Failed to fetch orders', 'error');
        setLoading(false);
    });
}, []); // The dependency array is now empty

    const getStatusBadge = (status) => {
        switch (status) {
            case 1: return <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Pending</span>;
            case 2: return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Confirmed</span>;
            case 3: return <span className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">Shipped</span>;
            case 4: return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Delivered</span>;
            case 5: return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Cancelled</span>;
            default: return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">Unknown</span>;
        }
    };

    if (loading) return <p>Loading orders...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Customer Orders</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{order._id}</td>
                                <td className="px-6 py-4">{order.user_id?.name || 'N/A'}</td>
                                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">₹{order.order_total.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">{getStatusBadge(order.order_status)}</td>
                                <td className="px-6 py-4 text-center">{order.payment_mode === 2 ? 'Online' : 'COD'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewOrders;