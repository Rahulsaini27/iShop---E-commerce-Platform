import React, { useContext, useRef, useState } from 'react';
import { IoIosAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { Context } from '../../../Context/MainContext';
import { MdEdit, MdDelete } from "react-icons/md";

const View = () => {
    const [toggle, setToggle] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const { openToast, category, categoryImageUrl, fetchCategory, API_BASE_URL, CATEGORY_BASE_URL } = useContext(Context);

    const nameRef = useRef();
    const slugRef = useRef();
    const categoryIdRef = useRef();
    const oldNameRef = useRef();

    const titleToSlug = () => {
        const slug = nameRef.current.value.toLowerCase().trim().replace(/\s+/g, '-').replace(/'/g, '');
        slugRef.current.value = slug;
    }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const slug = event.target.slug.value;
        const image = event.target.image.files[0];

        if (name && slug) {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("slug", slug);
            if (image) {
                formData.append("image", image);
            }

            if (isUpdate) {
                const cId = event.target.category_id.value;
                formData.append("old_name", event.target.old_name.value);
                axios.put(`${API_BASE_URL}${CATEGORY_BASE_URL}/update/${cId}`, formData)
                    .then((success) => {
                        if (success.data.status === 1) {
                            event.target.reset();
                            setToggle(false);
                            openToast(success.data.msg, "success");
                            fetchCategory();
                        } else {
                            openToast(success.data.msg, "error");
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        openToast("Client-side error", "error");
                    });
            } else {
                axios.post(`${API_BASE_URL}${CATEGORY_BASE_URL}/create`, formData)
                    .then((success) => {
                        if (success.data.status === 1) {
                            event.target.reset();
                            setToggle(false);
                            openToast(success.data.msg, "success");
                            fetchCategory();
                        } else {
                            openToast(success.data.msg, "error");
                        }
                    })
                    .catch(() => {
                        openToast("Client-side error", "error");
                    });
            }
        }
    };

    const deleteData = (_id, image_name) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axios.delete(`${API_BASE_URL}${CATEGORY_BASE_URL}/delete/${_id}/${image_name}`)
                .then((success) => {
                    if (success.data.status === 1) {
                        openToast(success.data.msg, "success");
                        fetchCategory();
                    } else {
                        openToast(success.data.msg, "error");
                    }
                })
                .catch(() => {
                    openToast("Client-side error", "error");
                });
        }
    };

    const changeStatus = (id, new_status) => {
        axios.patch(`${API_BASE_URL}${CATEGORY_BASE_URL}/change-status/${id}/${new_status}`)
            .then((success) => {
                if (success.data.status) {
                    openToast(success.data.msg, "success");
                    fetchCategory();
                } else {
                    openToast(success.data.msg, "error");
                }
            })
            .catch((error) => {
                openToast(error.message, "error");
            });
    };

    const editCart = (category) => {
        setToggle(true);
        setIsUpdate(true);
        setTimeout(() => {
            nameRef.current.value = category.name;
            slugRef.current.value = category.slug;
            categoryIdRef.current.value = category._id;
            oldNameRef.current.value = category.image;
        }, 0);
    };
    
    const openAddModal = () => {
        setIsUpdate(false);
        setToggle(true);
        setTimeout(() => {
            nameRef.current.value = '';
            slugRef.current.value = '';
            categoryIdRef.current.value = '';
            oldNameRef.current.value = '';
        }, 0)
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-semibold text-gray-800'>Category Listing</h1>
                <button onClick={openAddModal} type="button" className="text-white flex items-center gap-1 bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-4 py-2 text-center">
                    <IoIosAdd />
                    Add Category
                </button>
            </div>

            {toggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className='w-full max-w-lg bg-white rounded-lg shadow-lg'>
                        <div className='flex justify-between items-center p-4 border-b'>
                            <h1 className='text-2xl font-semibold'>{isUpdate ? "Edit" : "Add"} Category</h1>
                            <button onClick={() => setToggle(false)} type="button" className="text-gray-400 hover:text-gray-600">
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form encType='multipart/form-data' onSubmit={formSubmitHandler} className='p-6 space-y-4'>
                            <input type="hidden" name='category_id' ref={categoryIdRef} />
                            <input type="hidden" name='old_name' ref={oldNameRef} />

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    onChange={titleToSlug}
                                    ref={nameRef}
                                    placeholder='Enter Category Name'
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug
                                </label>
                                <input
                                    ref={slugRef}
                                    readOnly
                                    placeholder='Category Slug'
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <div className='flex justify-end pt-4'>
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Sr No.</th>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Slug</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.map((cat, index) => (
                            <tr key={cat._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">
                                    <img className='w-20 h-20 object-cover rounded' src={API_BASE_URL + categoryImageUrl + cat.image} alt={cat.name} />
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {cat.name}
                                </th>
                                <td className="px-6 py-4">{cat.slug}</td>
                                <td className="px-6 py-4">
                                    {cat.status ? (
                                        <button onClick={() => changeStatus(cat._id, false)} className="text-white font-medium rounded-lg text-xs px-3 py-1 bg-green-500 hover:bg-green-600">Active</button>
                                    ) : (
                                        <button onClick={() => changeStatus(cat._id, true)} className="text-white font-medium rounded-lg text-xs px-3 py-1 bg-red-500 hover:bg-red-600">Inactive</button>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex text-xl gap-4'>
                                        <MdDelete onClick={() => deleteData(cat._id, cat.image)} className='cursor-pointer text-red-500 hover:text-red-700' />
                                        <MdEdit onClick={() => editCart(cat)} className='cursor-pointer text-green-500 hover:text-green-700' />
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