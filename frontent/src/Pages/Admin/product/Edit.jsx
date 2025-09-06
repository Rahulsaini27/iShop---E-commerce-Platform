import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import Select from 'react-select';
import { Context } from '../../../Context/MainContext';
import makeAnimated from 'react-select/animated';
import { FileUploader } from "react-drag-drop-files";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const Edit = () => {

    const { colors, category, fetchCategory, fetchColor, API_BASE_URL, PRODUCT_BASE_URL, openToast } = useContext(Context);
    const { id } = useParams();
    const nameRef = useRef();
    const slugRef = useRef();
    const priceRef = useRef();
    const discountRef = useRef();
    const finalRef = useRef();

    const animatedComponents = makeAnimated();
    const [file, setFile] = useState(null);
    const [prodCategory, setProdCategory] = useState(null);
    const [prodColor, setProdColor] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const navigator = useNavigate();


    useEffect(() => {

        if (editProduct !== null && editProduct !== undefined) {
            setProdCategory({ value: editProduct?.category_id, label: editProduct?.category_id.name });
            const colorData = editProduct?.color.map(
                (color) => ({ value: color._id, label: color.name })
            );
            setProdColor(colorData);
        }
    }, [editProduct]);
    

    useEffect(() => {
        if (id != null) {
            axios.get(`${API_BASE_URL}${PRODUCT_BASE_URL}/${id}`)
                .then((success) => {

                    if (success.data.status === 1) {
                        setEditProduct(success.data.product);
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch product:", err);
                    openToast("Failed to fetch product data", "error");
                });
        }
    }, [id, API_BASE_URL, PRODUCT_BASE_URL, openToast]);



    
    useEffect(() => {
        fetchCategory();
        fetchColor();
    }, [fetchCategory, fetchColor]);

    const titleToslug = useCallback((title) => {
        return title.toLowerCase().trim().replaceAll(" ", "-").replaceAll("'", "");
    }, []);

    const calDiscount = useCallback(() => {
        const price = parseFloat(priceRef.current.value);
        const discountPer = parseFloat(discountRef.current.value);

        if (!isNaN(price) && !isNaN(discountPer)) {
            const d = price * (discountPer / 100);
            return price - d;
        }
        return '';
    }, []);

    const formSubmitHandler = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", event.target.name?.value);
        formData.append("slug", event.target.slug?.value);
        formData.append("price", event.target.price?.value);
        formData.append("discount_percent", event.target.discount?.value);
        formData.append("discount_price", event.target.final_price?.value);
        if (file) {
            formData.append("image", file);
        }
        formData.append("category", prodCategory.value._id);
        // FIX: Correctly mapped color values before sending
        const colorValues = prodColor.map(color => color.value);
        formData.append("color", JSON.stringify(colorValues));

        axios.patch(`${API_BASE_URL}${PRODUCT_BASE_URL}/update/${id}`, formData)
            .then((success) => {
                // FIX: Changed '==' to '==='
                if (success.data.status === 1) {
                    openToast(success.data.msg, "success");
                    navigator("/admin/product");
                } else {
                    openToast(success.data.msg, "error");
                }
            })
            .catch((error) => {
                console.log(error);
                openToast("Client side error", "error");
            });
    };
    
    const handleChange = (file) => setFile(file);
    const removeHandler = () => setFile(null);

    const ColorOptions = colors.map((color) => ({ label: color.name, value: color._id }));
    const CategoryOptions = category.map((cat) => ({ label: cat.name, value: cat }));

    return (
        <div>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-semibold mx-8 pb-2">Edit Product</h1>
                <form onSubmit={formSubmitHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {/* JSX remains the same, but with corrected logic and state handling */}
                    <div className='grid grid-cols-2 gap-8'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Product Name</label>
                            <input
                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value, slug: titleToslug(e.target.value) })}
                                ref={nameRef}
                                value={editProduct?.name || ''}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">Product Slug</label>
                            <input value={editProduct?.slug || ''} ref={slugRef} readOnly name="slug" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="slug" type="text" placeholder="Product Slug" />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-8'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
                            <input
                                value={editProduct?.price || ''}
                                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value, discount_price: calDiscount() })}
                                ref={priceRef}
                                min={0}
                                name="price"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="price"
                                type="number"
                                placeholder="Price"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">Discount %</label>
                            <input
                                value={editProduct?.discount_percent || ''}
                                onChange={(e) => setEditProduct({ ...editProduct, discount_percent: e.target.value, discount_price: calDiscount() })}
                                min={0}
                                max={99}
                                ref={discountRef}
                                name="discount"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="discount"
                                type="number"
                                placeholder=" Enter Discount %"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="final_price">Final Price</label>
                            <input value={editProduct?.discount_price || ''} ref={finalRef} readOnly name="final_price" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="final_price" type="number" placeholder="Final Price" />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-8'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
                            <Select onChange={(option) => setProdCategory(option)} value={prodCategory} className="basic-single" classNamePrefix="select" isSearchable={true} name="category" options={CategoryOptions} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">Color</label>
                            <Select onChange={(options) => setProdColor(options)} value={prodColor} className="basic-single" classNamePrefix="select" isSearchable={true} components={animatedComponents} name="color" isMulti options={ColorOptions} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Drag Image</label>
                        <span className='flex flex-col gap-2 '>
                            <FileUploader handleChange={handleChange} name="file" />
                            <h1>{file?.name}</h1>
                            {file && <span className='text-white rounded-md px-2 py-0.5 cursor-pointer bg-red-500 w-[75px]' onClick={removeHandler}>Remove</span>}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Edit;