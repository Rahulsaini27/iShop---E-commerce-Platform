import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteAdmin = () => {
    // We only need to check for the existence of the 'admin' user object.
    const { admin } = useSelector(store => store.user);

    if (admin && admin.role === 'admin') {
        return <Outlet />; // If admin is logged in, render the admin panel
    } else {
        return <Navigate to="/admin/login" />; // Otherwise, redirect to the admin login page
    }
};

export default ProtectedRouteAdmin;