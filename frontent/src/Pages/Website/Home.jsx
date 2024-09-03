import React, { useContext, useEffect, useState } from 'react';
import Container from '../../Components/Container';
import ProductBox from '../../Components/Website/ProductBox';
import { FaShippingFast } from "react-icons/fa";
import { RiRefund2Line } from "react-icons/ri";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Context } from '../../Context/MainContext';



const Home = () => {

    let { colors, category, fetchProduct, productImageUrl, fetchCategory, products, fetchColor } = useContext(Context);
    const [selCat, setSelCat] = useState(0);
    const [filterProduct, setFilterProduct] = useState([]);


    useEffect(
        () => {
            fetchCategory();
            fetchProduct();
        }, []
    )

    useEffect(
        () => {
            if (selCat != 0) {
                const data = products.filter(
                    (prod) => {
                        if (prod.category_id._id == selCat) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                )
                setFilterProduct(data);
            }
        }, [selCat]
    )
    return (
        <div>
            {/* bg-background started */}
            <div className='hidden md:block h-[500px] md:h-[650px] homeBackground'>
                <div className='max-w-[1280px] mx-auto flex justify-end  h-full'>
                    <img src="image\2_corousel.png" alt="" className='h-full pt-5 ' />
                </div>
            </div>
            {/* responsive bg bar */}
            <div className=' md:hidden h-[500px] md:h-[650px]  NavhomeBackground'>
                <div className='max-w-[1280px] mx-auto  flex justify-end relative h-full'>
                    <img src="image\3_Corousel@2x.png" alt="" className='h-96 max-w-full pt-5 absolute bottom-0	' />
                </div>
            </div>
            {/* bg-background Ended */}
            <Container>
                <p className='text-center uppercase text-3xl font-bold my-5 '> best seller</p>
                <ul className='hidden md:flex justify-center gap-5 text-md uppercase' typeof='none'>
                    <li onClick={() => setSelCat(0)} className={`${selCat == 0 ? 'text-blue-600 font-bold' : ""} cursor-pointer mb-5 text-[14px]`}>All</li>
                    {
                        category.map((cat, index) => {
                            return <li key={index} onClick={() => setSelCat(cat._id)} className={`${selCat == cat._id ? 'text-blue-600 font-bold' : ""} cursor-pointer mb-5 text-[14px]`}>{cat.name}</li>
                        })
                    }
                </ul>
                {/* Responsive menu item */}
                <div className='md:hidden flex justify-center'>
                    <select onChange={(e) => setSelCat(e.target.value)} className='block text-[14px] p-2 border uppercase w-[200px]'>
                        <option value={0} className='font-semibold cursor-pointer mb-5 text-[14px]'>All</option>
                        {
                            category.map((cat, index) => {
                                return <option value={cat._id} key={index} className='font-semibold cursor-pointer mb-5 text-[14px]'>{cat.name}</option>
                            })
                        }
                    </select>
                </div>
            </Container>
            <Container>
                <BestSeller products={selCat == 0 ? products : filterProduct} />
                <div className='text-[#33A0FF] font-bold underline underline-offset-8 text-center my-12' >Load More</div>
            </Container>
            <div className='homeBackground3'>
                <Container>
                    <div className=' '>
                        <div className='mx-auto flex relative '>
                            <div className='grid grid-cols-2 h-[500px] px-5 '>
                                <div className='text-[white] flex flex-col justify-center items-start'>
                                    <p className='text-[66px] my-8'>iPhone 6 Plus</p>
                                    <p className='text-[24px] max-w-[392px]'>Performance and design. Taken right to the edge.</p>
                                    <p className='my-10 font-bold underline text-[14px]'>SHOP NOW</p>
                                </div>
                                <img src="image\iphone_6_plus.png" alt="" className='max-w-[449px] h-full absolute right-0 top-0' />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container>
                <div className='grid lg:grid-cols-3'>
                    <div className='flex flex-col justify-center  p-10 gap-5 items-center px-10'>
                        <FaShippingFast className='text-[#FF6875] text-[70px] ' />
                        <p className='font-semibold'>FREE SHIPPING</p>
                        <p className='text-[16px] text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor minim veniam, quis nostrud reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
                    </div>
                    <div className='flex flex-col justify-center  p-10 gap-5 items-center px-10 '>
                        <RiRefund2Line className='text-[#FF6875] text-[70px] ' />
                        <p className='font-semibold'>100% REFUND</p>
                        <p className='text-[16px] text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor minim veniam, quis nostrud reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
                    </div>
                    <div className='flex flex-col justify-center  p-10 gap-5 items-center px-10'>
                        <MdOutlineSupportAgent className='text-[#FF6875] text-[70px] ' />
                        <p className='font-semibold'>SUPPORT 24/7</p>
                        <p className='text-[16px] text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor minim veniam, quis nostrud reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
                    </div>
                </div>
            </Container>
        </div>
    );
}

function BestSeller({ products }) {

    return (
        <div className='grid lg:grid-cols-4 md:grid-cols-2 '>
            {products &&
                products.map((prod, index) => {
                    return <ProductBox {...prod} key={index} />
                })
            }
        </div>)
}
export default Home;
