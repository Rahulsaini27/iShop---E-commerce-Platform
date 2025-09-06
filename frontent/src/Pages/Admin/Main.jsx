import React from 'react';
import SideBar from '../../Components/Admin/SideBar';
import Header from '../../Components/Admin/Header';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div className='flex h-screen bg-gray-100 font-sans'>
            <SideBar />
            <div className='flex-1 flex flex-col overflow-hidden'>
                <Header />
                <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8'>
                    <div className="container mx-auto">
                         <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Main;