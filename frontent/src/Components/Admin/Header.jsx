import React from 'react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
    // Extract the page title from the URL path
    const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);
    const path = window.location.pathname.split('/').pop();
    const pageTitle = path ? capitalize(path) : 'Dashboard';

    return (
        <header className='bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10'>
            <h1 className='text-2xl font-semibold text-gray-800'>{pageTitle}</h1>
            
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
                
                {/* Icons */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-indigo-600">
                        <FiBell size={22} />
                    </button>
                    <button className="text-gray-500 hover:text-indigo-600">
                        <FiUser size={22} />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
