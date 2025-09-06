import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../Context/MainContext';
import { FiBox } from 'react-icons/fi';

const AdminLogin = () => {
    const { API_BASE_URL, openToast, USER_BASE_URL } = useContext(Context);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    
    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        axios.post(`${API_BASE_URL + USER_BASE_URL}/login`, data)
            .then((success) => {
                if (success.data.status === 1) {
                    navigate("/admin"); 
                    
                    openToast("Admin login successful!", "success");
                }
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.msg || "Login failed. Please try again.";
                setError(errorMsg);
                openToast(errorMsg, "error");
            });
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                    <FiBox className="text-indigo-600 mb-4" size={40} />
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                        Admin Panel Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input id="email" name="email" type="email" required className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email address" />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input id="password" name="password" type="password" required className="w-full px-4 py-2 mt-4 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" />
                    </div>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <div>
                        <button type="submit" className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;