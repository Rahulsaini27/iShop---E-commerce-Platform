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
    const dispatcher = useDispatch();
    const cart = useSelector(store => store.cart);
    const user = useSelector(store => store.user);

    const menuItems = [
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Store",
            url: "/store"
        }, {
            name: "Iphone",
            url: "/iphone"
        }, {
            name: "Ipad",
            url: "/ipad"
        }, {
            name: "Macbook",
            url: "/macbook"
        }, {
            name: "Accessories",
            url: "/accessories"
        }
    ]
    return (
        <header className=' sticky top-0 bg-white z-[9999999999]'>
            <div className='shadow  	'>
                <Container >
                    <div className='hidden md:flex items-center p-3 justify-between '>
                        <div className='flex gap-3 items-center'>
                            <span>EN</span>
                            <IoMdArrowDropdown />
                            <span>₹</span>
                            <IoMdArrowDropdown />
                        </div>
                        <div className='flex gap-3 items-center'>
                            <FaRegUser />
                            {
                                user.data == null ?
                                    <Link to={'/login'}>
                                        <span>Login</span>
                                    </Link>
                                    :
                                    <>
                                       
                                       
                        </>
                            }

                        <Link to={'/cart'} className=' hover:text-red-500 cursor-pointer'>
                            <CiShoppingCart />
                        </Link>
                        <span className=''>{cart.data?.length} Items</span>
                        <span className='text-gray-400'>₹ {cart.total} </span>
                        <FaSearch className='ml-10' />
                    </div>
            </div>
        </Container>
            </div >
            <Container >
                <div className='flex  md:justify-center justify-between items-center  my-10 px-6'>
                    <img src="image/logo.svg.svg" alt="" className=' ' />
                    <GiHamburgerMenu className='text-3xl md:hidden' onClick={() => { setToggle(true) }} />
                </div>
            </Container>
            <Container>
                <div className='flex justify-center '>
                    <ul className=' hidden md:flex gap-5 text-md uppercase' typeof='none'>
                        {
                            menuItems.map((item, index) => {
                                return <Link key={index} to={item.url}>
                                    <li className='mb-10 hover:text-red-500'>{item.name}</li>
                                </Link>
                            })
                        }
                    </ul>
                    {/* responsive navbar */}
                    <div className={`h-screen w-full ${toggle ? 'left-[0%] ' : 'left-[-100%] '} duration-200 md:hidden gap-4 flex z-[99999999999] fixed top-0 text-2xl font-semibold responsiveNav overflow-hidden`}>
                        <div className='w-[80%] p-2 rounded-2xl flex bg-white items-center '>
                            <FaSearch className='text-black mx-5' />
                            <input type="text" className='w-[100%] rounded-2xl focus:outline-none text-black' placeholder='Search your item' />
                        </div>
                        {
                            menuItems.map((item, index) => {
                                return <Link key={index} to={item.url}>
                                    <div>{item.name}</div>
                                </Link>
                            })
                        }
                        <IoClose className='text-white text-5xl' onClick={() => { setToggle(false) }} />
                    </div>
                </div>
            </Container>
        </header >
    );
}

export default Header;
