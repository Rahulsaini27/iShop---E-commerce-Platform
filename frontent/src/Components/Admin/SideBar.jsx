import React from 'react';
import { MdCategory, MdDashboard, MdPayment, MdShoppingBasket } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosColorPalette } from "react-icons/io";
import { FiBox, FiLogOut } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../Reducers/UserSlice';

const SideBar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin', icon: <MdDashboard className="w-5 h-5" />, name: 'Dashboard' },
        { path: '/admin/orders', icon: <MdShoppingBasket className="w-5 h-5" />, name: 'Orders' },
        { path: '/admin/transactions', icon: <MdPayment className="w-5 h-5" />, name: 'Transactions' },
        { path: '/admin/category', icon: <MdCategory className="w-5 h-5" />, name: 'Categories' },
        { path: '/admin/color', icon: <IoIosColorPalette className="w-5 h-5" />, name: 'Colors' },
        { path: '/admin/product', icon: <FaProductHunt className="w-5 h-5" />, name: 'Products' }
    ];

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/admin/login');
    };

    return (
        <aside className="w-64 bg-slate-900 text-gray-300 flex flex-col h-screen">
            <div className="flex items-center justify-center gap-3 py-6 border-b border-slate-800">
                <FiBox className="text-indigo-400" size={30}/>
                <h6 className="font-sans text-2xl font-bold leading-relaxed text-white">IShop</h6>
            </div>
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link to={item.path}>
                                    <button className={`font-sans font-semibold text-sm py-3 rounded-lg w-full flex items-center gap-4 px-4 capitalize transition-all duration-300 ${isActive ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </button>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-800">
                 <button onClick={handleLogout} className="font-sans font-semibold text-sm py-3 rounded-lg w-full flex items-center gap-4 px-4 capitalize transition-all duration-300 text-gray-400 hover:bg-red-500 hover:text-white">
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default SideBar;