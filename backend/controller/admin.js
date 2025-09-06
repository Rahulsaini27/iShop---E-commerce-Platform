const { decryptPassword } = require("../helper");
const User = require("../models/user");
const Order = require("../models/order");
const mongoose = require('mongoose');



class AdminController {
    login(data) {
        return new Promise(async (resolve, reject) => {
            try {
                // Find a user who has the 'admin' role
                const adminUser = await User.findOne({ email: data.email, role: 'admin' });

                if (adminUser) {
                    // Check if the password matches
                    if (decryptPassword(adminUser.password) === data.password) {
                        // Return user data without a token
                        resolve({
                            msg: "Login successful",
                            status: 1,
                            user: { name: adminUser.name, email: adminUser.email, role: adminUser.role }
                        });
                    } else {
                        reject({ msg: "Invalid credentials", status: 0 });
                    }
                } else {
                    reject({ msg: "Admin account not found", status: 0 });
                }
            } catch (error) {
                reject({ msg: "Internal server error", status: 0 });
            }
        });
    }



    getDashboardStats() {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. Calculate Total Revenue (only from successful orders, status >= 2)
                const totalRevenueResult = await Order.aggregate([
                    { $match: { order_status: { $gte: 2 } } }, // Assuming status 2 means 'Paid/Processing'
                    { $group: { _id: null, totalRevenue: { $sum: "$order_total" } } }
                ]);

                const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

                // 2. Get Total Orders
                const totalOrders = await Order.countDocuments();

                // 3. Get New Customers (e.g., registered in the last 30 days)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const newCustomers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

                // 4. Get Sales Data for Chart (Sales per day for the last 7 days)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const salesData = await Order.aggregate([
                    { $match: { createdAt: { $gte: sevenDaysAgo }, order_status: { $gte: 2 } } },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            totalSales: { $sum: "$order_total" }
                        }
                    },
                    { $sort: { _id: 1 } } // Sort by date
                ]);

                // Format for charting library
                const formattedSalesData = salesData.map(item => ({
                    date: item._id,
                    sales: item.totalSales
                }));

                resolve({
                    status: 1,
                    stats: {
                        totalRevenue,
                        totalOrders,
                        newCustomers,
                        salesData: formattedSalesData
                    }
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                reject({ msg: "Internal server error", status: 0 });
            }
        });
    }



}

module.exports = AdminController;