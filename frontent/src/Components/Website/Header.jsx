import React, { useState } from 'react';
import Container from '../Container';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Reducers/UserSlice';
import { emptyCart } from '../../Reducers/cartSlice';

const Header = () => {
    const [toggle, setToggle] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const dispatcher = useDispatch();
    const cart = useSelector(store => store.cart);
    const user = useSelector(store => store.user);

    const handleLogout = () => {
        dispatcher(logout());
        dispatcher(emptyCart());
    };

    const menuItems = [
        { name: "Home", url: "/" },
        { name: "Store", url: "/store" },
        { name: "Iphone", url: "/store/iphone" },
        { name: "Ipad", url: "/store/ipad" },
        { name: "Macbook", url: "/store/macbook" },
        { name: "Accessories", url: "/store/accessories" }
    ];

    return (
        <header className='sticky top-0 bg-white z-[999]'>
            <div className='shadow'>
                <Container>
                    <div className='hidden md:flex items-center p-3 justify-between'>
                        <div className='flex gap-3 items-center'>
                            <span>EN</span>
                            <IoMdArrowDropdown />
                            <span>₹</span>
                            <IoMdArrowDropdown />
                        </div>
                        <div className='flex gap-4 items-center relative'>
                            {user.data == null ? (
                                <Link to={'/login'} className='flex items-center gap-2 hover:text-red-500'>
                                    <FaRegUser />
                                    <span>Login</span>
                                </Link>
                            ) : (
                                <div className='relative'>
                                    <div onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className='flex items-center gap-2 cursor-pointer'>
                                        <FaRegUser />
                                        <span>{user.data.name}</span>
                                        <IoMdArrowDropdown />
                                    </div>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                            <Link to="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            <Link to={'/cart'} className='flex items-center gap-2 hover:text-red-500 cursor-pointer'>
                                <CiShoppingCart className='text-xl' />
                                <span>{cart.data?.length} Items</span>
                            </Link>
                            <span className='text-gray-400'>₹ {cart.total}</span>
                            <FaSearch className='ml-10 cursor-pointer' />
                        </div>
                    </div>
                </Container>
            </div>
            <Container>
                <div className='flex md:justify-center justify-between items-center my-6 md:my-10 px-4'>
                    <Link to="/">
                        <img src="/image/logo.svg.svg" alt="iShop Logo" className='h-8 md:h-10' />
                    </Link>
                    <div className="md:hidden flex items-center gap-4">
                        <Link to={'/cart'}>
                            <CiShoppingCart className='text-3xl' />
                        </Link>
                        <GiHamburgerMenu className='text-3xl cursor-pointer' onClick={() => setToggle(true)} />
                    </div>
                </div>
            </Container>
            <Container>
                <nav className='hidden md:flex justify-center'>
                    <ul className='flex gap-8 text-md uppercase' typeof='none'>
                        {menuItems.map((item, index) => (
                            <Link key={index} to={item.url}>
                                <li className='mb-10 hover:text-red-500 transition-colors'>{item.name}</li>
                            </Link>
                        ))}
                    </ul>
                </nav>
                {/* Responsive Navbar */}
                <div className={`fixed top-0 h-screen w-full bg-black bg-opacity-80 z-[1000] transition-transform duration-300 ease-in-out ${toggle ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                    <div className="h-full w-[85%] sm:w-[60%] bg-white p-6">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-2xl font-bold">Menu</span>
                            <IoClose className='text-4xl cursor-pointer' onClick={() => setToggle(false)} />
                        </div>
                        <ul className='flex flex-col gap-6 text-xl'>
                            {menuItems.map((item, index) => (
                                <Link key={index} to={item.url} onClick={() => setToggle(false)}>
                                    <li className='hover:text-red-500'>{item.name}</li>
                                </Link>
                            ))}
                        </ul>
                        <hr className="my-6" />
                        <div className="flex flex-col gap-4 text-xl">
                            {user.data ? (
                                <>
                                    <Link to="/my-profile" onClick={() => setToggle(false)} className='hover:text-red-500'>My Profile</Link>
                                    <button onClick={() => { handleLogout(); setToggle(false); }} className='text-left hover:text-red-500'>Logout</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setToggle(false)} className='hover:text-red-500'>Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    );
}

export default Header;