import React, { useContext, useEffect, useState } from 'react';
import Container from '../../Components/Container';
import ProductBox from '../../Components/Website/ProductBox';
import { FaShippingFast } from "react-icons/fa";
import { RiRefund2Line } from "react-icons/ri";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Context } from '../../Context/MainContext';

const Home = () => {
    const { category, fetchProduct, products, fetchCategory } = useContext(Context);
    const [selCat, setSelCat] = useState(0);
    const [filterProduct, setFilterProduct] = useState([]);

    useEffect(() => {
        fetchCategory();
        fetchProduct();
    }, [fetchCategory, fetchProduct]);

    useEffect(() => {
        if (selCat !== 0) {
            const data = products.filter(prod => prod.category_id._id === selCat);
            setFilterProduct(data);
        } else {
            setFilterProduct(products);
        }
    }, [selCat, products]);

    return (
        <div>
            {/* Hero Section */}
            <div className='bg-gradient-to-r from-[#E71D3A] via-[#ECC7C1] to-[#42A8FE]'>
                <div className='hidden md:block h-[500px] md:h-[650px]'>
                    <div className='max-w-[1280px] mx-auto flex justify-end h-full'>
                        <img src="/image/2_corousel.png" alt="Hero Banner" className='h-full pt-5 object-contain' />
                    </div>
                </div>
                <div className='md:hidden h-[500px]'>
                    <div className='max-w-[1280px] mx-auto flex justify-center items-end relative h-full'>
                        <img src="/image/3_Corousel@2x.png" alt="Mobile Hero Banner" className='h-96 max-w-full' />
                    </div>
                </div>
            </div>

            {/* Best Seller Section */}
            <Container>
                <h2 className='text-center uppercase text-3xl font-bold my-8 md:my-12'>Best Sellers</h2>
                <div className='flex justify-center mb-8'>
                    <select onChange={(e) => setSelCat(e.target.value)} className='md:hidden block text-lg p-2 border rounded-md uppercase w-full max-w-xs'>
                        <option value={0}>All</option>
                        {category.map((cat) => (
                            <option value={cat._id} key={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <ul className='hidden md:flex flex-wrap justify-center gap-x-8 gap-y-4 text-md uppercase'>
                        <li onClick={() => setSelCat(0)} className={`${selCat === 0 ? 'text-blue-600 font-bold' : ""} cursor-pointer`}>All</li>
                        {category.map((cat) => (
                            <li key={cat._id} onClick={() => setSelCat(cat._id)} className={`${selCat === cat._id ? 'text-blue-600 font-bold' : ""} cursor-pointer`}>{cat.name}</li>
                        ))}
                    </ul>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {(selCat === 0 ? products : filterProduct).map((prod) => (
                        <ProductBox {...prod} key={prod._id} />
                    ))}
                </div>
                <div className='text-[#33A0FF] font-bold underline underline-offset-8 text-center my-12 cursor-pointer'>Load More</div>
            </Container>

            {/* iPhone 6 Plus Banner */}
            <div className='bg-blue-500 py-12'>
                <Container>
                    <div className='grid grid-cols-1 md:grid-cols-2 items-center text-white'>
                        <div className='p-5 text-center md:text-left'>
                            <p className='text-4xl md:text-6xl my-4 md:my-8'>iPhone 6 Plus</p>
                            <p className='text-lg md:text-2xl max-w-md mx-auto md:mx-0'>Performance and design. Taken right to the edge.</p>
                            <p className='my-8 md:my-10 font-bold underline text-md cursor-pointer'>SHOP NOW</p>
                        </div>
                        <div className='flex justify-center md:justify-end'>
                            <img src="/image/iphone_6_plus.png" alt="iPhone 6 Plus" className='max-w-xs md:max-w-md' />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Services Section */}
            <Container>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 my-12'>
                    <ServiceCard icon={<FaShippingFast />} title="FREE SHIPPING" />
                    <ServiceCard icon={<RiRefund2Line />} title="100% REFUND" />
                    <ServiceCard icon={<MdOutlineSupportAgent />} title="SUPPORT 24/7" />
                </div>
            </Container>
        </div>
    );
}

const ServiceCard = ({ icon, title }) => (
    <div className='flex flex-col items-center text-center p-6 gap-4'>
        <div className='text-red-500 text-7xl'>{icon}</div>
        <p className='font-semibold text-lg'>{title}</p>
        <p className='text-base text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor minim veniam, quis nostrud.</p>
    </div>
);

export default Home;