import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../../../Context/MainContext';

const ViewTransactions = () => {
    const { API_BASE_URL, openToast } = useContext(Context);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`${API_BASE_URL}/admin/transactions`)
            .then(response => {
                if (response.data.status === 1) {
                    setTransactions(response.data.transactions);
                } else {
                    openToast(response.data.msg, 'error');
                }
                setLoading(false);
            })
            .catch(error => {
                openToast(error.response?.data?.msg || 'Failed to fetch transactions', 'error');
                setLoading(false);
            });
    }, [API_BASE_URL, openToast]);

    if (loading) return <p>Loading transactions...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Transactions</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Transaction ID</th>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(trx => (
                            <tr key={trx._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{trx._id}</td>
                                <td className="px-6 py-4">{trx.userId?.name || 'N/A'}</td>
                                <td className="px-6 py-4">{new Date(trx.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">₹{trx.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">
                                    {trx.payment_status ? (
                                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Success</span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Failed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTransactions;