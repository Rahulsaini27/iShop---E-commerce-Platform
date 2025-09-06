import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../Context/MainContext';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../Reducers/UserSlice';

const Signup = () => {
    const { API_BASE_URL, USER_BASE_URL, openToast } = useContext(Context);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordColor, setPasswordColor] = useState('');

    const navigator = useNavigate();
    const dispatcher = useDispatch();

    const signupHandler = (e) => {
        e.preventDefault();
        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };
        axios.post(API_BASE_URL + USER_BASE_URL + "/register", data)
            .then((success) => {
                // FIX: Changed '==' to '===' for strict equality checking
                if (success.data.status === 1) {
                    dispatcher(login({ user: success.data.user }));
                    openToast(success.data.msg, "success");
                    navigator("/");
                } else {
                    openToast(success.data.msg, "error");
                }
            })
            .catch((error) => {
                console.log(error);
                openToast("Client side error", "error");
            });
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        if (password.length < 6) {
            setPasswordStrength('Password is too weak');
            setPasswordColor('text-red-500');
        } else if (password.length < 10) {
            setPasswordStrength('Password is moderate');
            setPasswordColor('text-yellow-500');
        } else {
            setPasswordStrength('Password is strong');
            setPasswordColor('text-green-500');
        }
    };

    return (
        <div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-10 w-auto" src="/image/logo.svg.svg" alt="Your Company" />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create your account
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={signupHandler} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <div className="mt-2">
                                <input id="name" name="name" type="text" placeholder='Enter Your name' required className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input id="email" placeholder='Enter Your email id' name="email" type="email" required className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <span className={`text-sm ${passwordColor}`}>{passwordStrength}</span>
                            </div>
                            <div className="mt-2">
                                <input placeholder='Enter Your password' id="password" name="password" type="password" autoComplete="current-password" required onChange={handlePasswordChange} className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Sign up
                            </button>
                        </div>
                    </form>
                    <p className="text-sm font-medium text-gray-900 my-8">
                        You have an account? <Link to={'/login'} className='font-semibold text-indigo-600'>Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;