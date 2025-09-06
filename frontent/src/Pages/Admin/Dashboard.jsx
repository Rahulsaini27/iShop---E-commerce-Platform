// Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDollarSign, FiShoppingCart, FiUsers, FiBarChart2 } from 'react-icons/fi';
// A popular charting library - you need to install it: npm install recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Reusable StatCard component (no changes needed here)
const StatCard = ({ icon, title, value, change, changeType }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                {/* Optional: Add logic for dynamic change later */}
                {/* <p className={`text-sm mt-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                    {change}
                </p> */}
            </div>
            <div className="bg-indigo-500 text-white rounded-full p-4">
                {icon}
            </div>
        </div>
    );
};

const Dashboard = () => {
    // State to hold our data
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Your API base URL
    const API_BASE_URL = 'http://localhost:5000/admin'; // Adjust if your URL is different

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use Promise.all to fetch stats and orders in parallel
                const [statsResponse, ordersResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/stats`),
                    axios.get(`${API_BASE_URL}/orders`)
                ]);

                if (statsResponse.data.status === 1) {
                    setStats(statsResponse.data.stats);
                }
                
                if (ordersResponse.data.status === 1) {
                    // Get only the 5 most recent orders for the dashboard
                    setRecentOrders(ordersResponse.data.orders.slice(0, 5));
                }
                
            } catch (err) {
                setError("Failed to fetch dashboard data. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Display a loading state
    if (loading) {
        return <div className="text-center p-10">Loading Dashboard...</div>;
    }

    // Display an error state
    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    // Order status mapping for display
    const getOrderStatus = (status) => {
        switch (status) {
            case 1: return { text: 'Pending', style: 'bg-yellow-100 text-yellow-800' };
            case 2: return { text: 'Paid', style: 'bg-blue-100 text-blue-800' };
            case 3: return { text: 'Shipped', style: 'bg-indigo-100 text-indigo-800' };
            case 4: return { text: 'Delivered', style: 'bg-green-100 text-green-800' };
            case 5: return { text: 'Canceled', style: 'bg-red-100 text-red-800' };
            default: return { text: 'Unknown', style: 'bg-gray-100 text-gray-800' };
        }
    };

    return (
        <div className="space-y-8">
            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    icon={<FiDollarSign size={24} />} 
                    title="Total Revenue" 
                    value={`$${stats?.totalRevenue.toFixed(2) || '0.00'}`} 
                />
                <StatCard 
                    icon={<FiShoppingCart size={24} />} 
                    title="Total Orders" 
                    value={stats?.totalOrders || '0'} 
                />
                <StatCard 
                    icon={<FiUsers size={24} />} 
                    title="New Customers (Last 30d)" 
                    value={stats?.newCustomers || '0'}
                />
            </div>

            {/* Sales Chart Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview (Last 7 Days)</h3>
                <div style={{ height: '400px' }}>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.salesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="sales" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
             {/* Recent Orders Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50 text-sm text-gray-600">
                                <th className="p-4">Customer</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-700">{order.shipping_details.first_name} {order.shipping_details.last_name}</td>
                                    <td className="p-4 text-gray-700">${order.order_total.toFixed(2)}</td>
                                    <td className="p-4 text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getOrderStatus(order.order_status).style}`}>
                                            {getOrderStatus(order.order_status).text}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
}

export default Dashboard;