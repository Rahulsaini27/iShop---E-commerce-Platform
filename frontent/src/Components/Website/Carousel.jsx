import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carousel = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Number of items to show at once
    const itemsToShow = 3;

    const prevItem = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - itemsToShow : prevIndex - 1));
    };

    const nextItem = () => {
        setCurrentIndex((prevIndex) => (prevIndex >= items.length - itemsToShow ? 0 : prevIndex + 1));
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto">
            <div className="overflow-hidden">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)` }}
                >
                    {items.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 p-2">
                            {/* You can place your ProductBox or any other card component here */}
                            <div className="bg-white rounded-lg shadow-md p-4 h-full">
                                <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4 rounded-md" />
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-gray-600 mt-2">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 text-gray-700 hover:bg-gray-100"
                onClick={prevItem}
            >
                <FaChevronLeft />
            </button>
            <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 text-gray-700 hover:bg-gray-100"
                onClick={nextItem}
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default Carousel;