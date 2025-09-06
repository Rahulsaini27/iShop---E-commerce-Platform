import React, { useContext, } from 'react';
import { Context } from '../../../Context/MainContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Add = () => {
    const { API_BASE_URL, COLOR_BASE_URL, openToast } = useContext(Context);
    const navigate = useNavigate();

    const formSubmitHandler = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const color = event.target.color.value;

        if (name && color) {
            axios.post(`${API_BASE_URL}${COLOR_BASE_URL}/create`, { name, color })
                .then((success) => {
                    if (success.data.status === 1) {
                        openToast(success.data.msg, "success");
                        navigate("/admin/color");
                    } else {
                        openToast(success.data.msg, "error");
                    }
                })
                .catch(() => {
                    openToast("Client-side error", "error");
                });
        } else {
            openToast("Please fill in all fields", "error");
        }
    };

    return (
        <div className='bg-white shadow-md rounded-lg p-6'>
            <h1 className='text-2xl font-semibold mb-4'>Add Color</h1>
            <form onSubmit={formSubmitHandler} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Color Name
                        </label>
                        <input
                            placeholder='Enter Color Name'
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                        </label>
                        <input
                            type="color"
                            id="color"
                            name="color"
                            className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Add;