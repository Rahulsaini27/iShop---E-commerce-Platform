import React from 'react';
import Container from '../Container'; // Assuming this component exists for max-width and centering
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-6">
                    {/* Brand Info */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h2 className="text-2xl font-bold text-white mb-4">iShop</h2>
                        <p className="text-gray-400">Your destination for the latest in Apple products and accessories. Experience the future, today.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Shop</h3>
                        <ul className="space-y-2">
                            <li><Link to="/store/iphone" className="hover:text-white transition-colors">iPhone</Link></li>
                            <li><Link to="/store/ipad" className="hover:text-white transition-colors">iPad</Link></li>
                            <li><Link to="/store/macbook" className="hover:text-white transition-colors">MacBook</Link></li>
                            <li><Link to="/store/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Join Our Newsletter</h3>
                        <form className="flex">
                            <input type="email" placeholder="Your email" className="w-full rounded-l-md px-3 py-2 text-gray-800 outline-none" />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md">Go</button>
                        </form>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="hover:text-white"><FaFacebook size={24} /></a>
                            <a href="#" className="hover:text-white"><FaTwitter size={24} /></a>
                            <a href="#" className="hover:text-white"><FaInstagram size={24} /></a>
                            <a href="#" className="hover:text-white"><FaLinkedin size={24} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 py-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} iShop. All Rights Reserved.</p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;