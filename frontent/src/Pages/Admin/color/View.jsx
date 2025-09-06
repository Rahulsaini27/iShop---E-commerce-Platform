import React, { useContext, useEffect } from 'react';
import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { Context } from '../../../Context/MainContext';
import axios from 'axios';
import { MdEdit, MdDelete } from "react-icons/md";

const View = () => {
    const { colors, fetchColor, openToast, API_BASE_URL, COLOR_BASE_URL } = useContext(Context);

    useEffect(() => {
        fetchColor();
    }, []);

    const changeStatus = (id, new_status) => {
        axios.patch(`${API_BASE_URL}${COLOR_BASE_URL}/change-status/${id}/${new_status}`)
            .then((success) => {
                if (success.data.status) {
                    openToast(success.data.msg, "success");
                    fetchColor();
                } else {
                    openToast(success.data.msg, "error");
                }
            })
            .catch((error) => {
                openToast(error.message, "error");
            });
    };

    const deleteData = (_id) => {
        if (window.confirm("Are you sure you want to delete this color?")) {
            axios.delete(`${API_BASE_URL}${COLOR_BASE_URL}/delete/${_id}`)
                .then((success) => {
                    if (success.data.status === 1) {
                        openToast(success.data.msg, "success");
                        fetchColor();
                    } else {
                        openToast(success.data.msg, "error");
                    }
                })
                .catch(() => {
                    openToast("Client-side error", "error");
                });
        }
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-semibold text-gray-800'>Color Listing</h1>
                <Link to="/admin/color/add">
                    <button type="button" className="text-white flex items-center gap-1 bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-4 py-2 text-center">
                        <IoIosAdd />
                        Add Color
                    </button>
                </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Sr No.</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Color</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colors.map((color, index) => (
                            <tr key={color._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{index + 1}</td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {color.name}
                                </th>
                                <td className="px-6 py-4">
                                    <span className='h-6 w-6 rounded-full inline-block' style={{ backgroundColor: color.code }}></span>
                                </td>
                                <td className="px-6 py-4">
                                    {color.status ? (
                                        <button onClick={() => changeStatus(color._id, false)} className="text-white font-medium rounded-lg text-xs px-3 py-1 bg-green-500 hover:bg-green-600">Active</button>
                                    ) : (
                                        <button onClick={() => changeStatus(color._id, true)} className="text-white font-medium rounded-lg text-xs px-3 py-1 bg-red-500 hover:bg-red-600">Inactive</button>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex text-xl gap-4'>
                                        <MdDelete onClick={() => deleteData(color._id)} className='cursor-pointer text-red-500 hover:text-red-700' />
                                        <Link to={`/admin/color/edit/${color._id}`}>
                                            <MdEdit className='cursor-pointer text-green-500 hover:text-green-700' />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default View;