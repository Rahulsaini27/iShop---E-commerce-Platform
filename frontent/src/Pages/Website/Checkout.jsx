import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useRazorpay from 'react-razorpay';
import { Context } from '../../Context/MainContext';
import { emptyCart } from '../../Reducers/cartSlice';

const Checkout = () => {
    const [Razorpay] = useRazorpay();
    const { products, productImageUrl, API_BASE_URL, fetchProduct, CART_ORDER_URL } = useContext(Context);
    
    // Selectors and Hooks
    const user = useSelector(store => store.user);
    const cart = useSelector(store => store.cart);
    const navigator = useNavigate();
    const dispatcher = useDispatch();

    // State Management
    const [cartProduct, setCartProduct] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        Street: '',
        Locality: '',
        City: '',
        State: '',
        pin: '',
        phone: '',
        email: '',
        payment_mode: '2', // Default to 'Online'
    });
    const [processing, setProcessing] = useState(false);

    // Effect to pre-fill form data from Redux store
    useEffect(() => {
        if (user.data) {
            setFormData(prev => ({
                ...prev,
                first_name: user.data.name || '',
                Street: user.data.street || '',
                Locality: user.data.locality || '',
                City: user.data.city || '',
                pin: user.data.pin || '',
                phone: user.data.phone || '',
                email: user.data.email || '',
            }));
        }
    }, [user.data]);

    // Effect to fetch products on component mount
    useEffect(() => {
        fetchProduct();
    }, []);

    // Effect to combine cart and product data
    useEffect(() => {
        if (products.length > 0 && cart.data.length > 0) {
            const data = products.flatMap(p =>
                cart.data
                    .filter(c => c.pId === p._id)
                    .map(c => ({ ...c, ...p }))
            );
            setCartProduct(data);
        } else {
            setCartProduct([]);
        }
    }, [cart.data, products]);

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const deatailsFormHandler = async (e) => {
        e.preventDefault();

        if (!user.data || !user.data._id) {
            alert("You must be logged in to place an order.");
            return;
        }
        if (cartProduct.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        setProcessing(true);
        const shipping_details = { ...formData };
        delete shipping_details.payment_mode;

        const payment_mode = parseInt(formData.payment_mode);
        const order_total = cart.total + (payment_mode === 1 ? 50 : 0);

        try {
            const response = await axios.post(`${API_BASE_URL}${CART_ORDER_URL}/place-order`, {
                user_id: user.data._id,
                shipping_details,
                order_total,
                payment_mode,
                product_details: cartProduct,
            });

            const { data } = response;
            if (data.status === 1) {
                if (payment_mode === 1) { // COD
                    dispatcher(emptyCart());
                    navigator(`/thank-you/${data.order_id}`);
                } else { // Online Payment
                    initRazorpayOrder(
                        data.order_id,
                        order_total,
                        data.razor_order,
                        shipping_details
                    );
                }
            } else {
                alert(data.msg || "Failed to place order. Please try again.");
                setProcessing(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.msg || "A network error occurred. Please try again.";
            alert(errorMessage);
            setProcessing(false);
        }
    };

    const initRazorpayOrder = (order_id, amount, razorpayOrder, userData) => {
        const options = {
            key: "rzp_test_R6I1rshvL0HKs9", // Your public Razorpay Key ID
            amount: amount * 100,
            currency: "INR",
            name: "IShop",
            description: "Thank you for your purchase",
            image: "/logo.svg", // Path from public folder
            order_id: razorpayOrder.id,
            handler: async (razorpay_response) => {
                try {
                    await axios.post(`${API_BASE_URL}${CART_ORDER_URL}/payment-success`, { order_id, razorpay_response });
                    dispatcher(emptyCart());
                    navigator(`/thank-you/${order_id}`);
                } catch (error) {
                    alert("Payment successful, but failed to update order status. Please contact support.");
                }
            },
            prefill: {
                name: `${userData.first_name} ${userData.last_name}`,
                email: userData.email,
                contact: userData.phone,
            },
            theme: { color: "#FF4252" },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", async (response) => {
            await axios.post(`${API_BASE_URL}${CART_ORDER_URL}/payment-failed`, { 
                order_id, 
                razorpay_response: {
                    razorpay_order_id: response.error.metadata.order_id,
                    razorpay_payment_id: response.error.metadata.payment_id,
                }
            });
            navigator("/");
        });

        rzp1.open();
        setProcessing(false);
    };

    const shippingCost = formData.payment_mode === '1' ? 50 : 0;
    const totalAmount = cart.total + shippingCost;

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
            <div className="bg-white p-4 sm:p-8 shadow-md rounded-lg">
                <form onSubmit={deatailsFormHandler} className="grid grid-cols-12 gap-4 md:gap-9">
                    {/* Shipping Details Section */}
                    <div className="col-span-12 md:col-span-7 lg:col-span-8">
                        <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Shipping Details</h2>
                        <div className="space-y-4">
                            {/* Input fields... */}
                            {/* Full Name */}
                             <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input className="input-style" placeholder="First Name" type="text" required name='first_name' value={formData.first_name} onChange={handleInputChange} />
                                    <input className="input-style" placeholder="Last Name" type="text" required name='last_name' value={formData.last_name} onChange={handleInputChange} />
                                </div>
                            </div>
                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
                                    <input className="input-style" placeholder="Street Address" type="text" required name='Street' value={formData.Street} onChange={handleInputChange} />
                                    <input className="input-style" placeholder="Locality / Area" type="text" required name='Locality' value={formData.Locality} onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                    <input className="input-style" placeholder="City" type="text" required name='City' value={formData.City} onChange={handleInputChange} />
                                    <input className="input-style" placeholder="State" type="text" required name='State' value={formData.State} onChange={handleInputChange} />
                                    <input className="input-style" placeholder="PIN Code" type="number" name='pin' required value={formData.pin} onChange={handleInputChange} minLength={6} maxLength={6} />
                                </div>
                            </div>
                            {/* Contact */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input className="input-style" placeholder="10-digit mobile number" required name='phone' type='tel' pattern="[0-9]{10}" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">E-mail</label>
                                    <input required className="input-style" placeholder="example@email.com" type="email" name='email' value={formData.email} onChange={handleInputChange} />
                                </div>
                            </div>
                            {/* Payment Mode */}
                            <div>
                                <h2 className="block text-lg font-medium py-2 mt-4 border-b">Mode of Payment</h2>
                                <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-10">
                                    <label className="flex items-center text-gray-700 font-bold cursor-pointer">
                                        <input className="mr-2 h-4 w-4" type="radio" name="payment_mode" value="1" checked={formData.payment_mode === '1'} onChange={handleInputChange} />
                                        <span>COD (+ ₹50 Extra)</span>
                                    </label>
                                    <label className="flex items-center text-gray-700 font-bold cursor-pointer">
                                        <input className="mr-2 h-4 w-4" type="radio" name="payment_mode" value="2" checked={formData.payment_mode === '2'} onChange={handleInputChange} />
                                        <span>Online</span>
                                    </label>
                                </div>
                            </div>
                            <button className="bg-zinc-800 text-white hover:bg-zinc-900 rounded-md text-sm font-medium px-6 py-3 disabled:bg-zinc-400 disabled:cursor-not-allowed" type="submit" disabled={processing}>
                                {processing ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
                            </button>
                        </div>
                    </div>

                    {/* Cart Summary Section */}
                    <div className='col-span-12 md:col-span-5 lg:col-span-4 bg-gray-50 p-6 rounded-lg h-fit'>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-4">Your Cart Summary</h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {cartProduct.length > 0 ? cartProduct.map((pro) => (
                                <div key={pro._id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={`${API_BASE_URL}${productImageUrl}${pro.image}`} width={64} height={64} alt={pro.name} className="rounded-md border" />
                                        <div className="ml-4 text-sm">
                                            <div className='font-semibold'>{pro.name}</div>
                                            <div className="text-gray-600">₹ {pro.discount_price} x {pro.qty}</div>
                                        </div>
                                    </div>
                                    <div className="font-semibold">₹ {pro.discount_price * pro.qty}</div>
                                </div>
                            )) : <p className="text-center text-gray-500">Your cart is empty.</p>}
                        </div>
                        {cartProduct.length > 0 && (
                            <div className="text-sm mt-6 border-t pt-4 space-y-2">
                                <div className="flex justify-between"><span>Subtotal</span><span>₹ {cart.total.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>₹ {shippingCost.toFixed(2)}</span></div>
                                <hr className="my-2" />
                                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹ {totalAmount.toFixed(2)}</span></div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Checkout;