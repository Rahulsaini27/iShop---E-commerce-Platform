// const Order = require("../models/order");
// const Cart = require("../models/cart");
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Transaction = require("../models/transaction");


// var instance = new Razorpay({
//     key_id: 'rzp_test_vNoztmT3ky59rZ',
//     key_secret: 'gKe4sYCv34witrbNBPRh7FY5',
// });



// class OrderController {

//     generateSignature(orderId, paymentId, secret) {
//         const message = orderId + "|" + paymentId;
//         const hmac = crypto.createHmac('sha256', secret);
//         hmac.update(message);
//         return hmac.digest('hex');
//     }

//     //  to verify signature
//     verifySignature(orderId, paymentId, receivedSignature, secret = "gKe4sYCv34witrbNBPRh7FY5") {
//         const generatedSignature = this.generateSignature(orderId, paymentId, secret);
//         return generatedSignature == receivedSignature;
//     }




//     placeOrder({ user_id, shipping_details, order_total, payment_mode, product_details }) {
//         return new Promise(
//             async (res, rej) => {
//                 try {
//                     console.log(user_id, shipping_details, order_total, payment_mode, product_details)
//                     // return;
//                     const order = new Order({
//                         user_id, shipping_details, order_total, payment_mode, product_details
//                     })
//                     order.save()
//                         .then(
//                             async (success) => {
//                                 if (payment_mode == 2) {
//                                     var options = {
//                                         amount: order_total * 100,  // amount in the smallest currency unit
//                                         currency: "INR",
//                                         receipt: order._id,
//                                     };
//                                     instance.orders.create(options,
//                                         async function (err, razor_order) {
//                                             console.log(err)
//                                             if (err) {
//                                                 rej({
//                                                     msg: "Unable to place Order",
//                                                     status: 0
//                                                 })
//                                             } else {
//                                                 await Cart.deleteMany(
//                                                     { user_id: user_id }
//                                                 )
//                                                 res({
//                                                     order_id: order._id,
//                                                     msg: "Your Order Placed  online",
//                                                     status: 1,
//                                                     razor_order
//                                                 })
//                                             }
//                                         });

//                                 } else {
//                                     await Cart.deleteMany(
//                                         { user_id: user_id }
//                                     )
//                                     res({
//                                         order_id: order._id,
//                                         msg: "Your Order Placed through offline",
//                                         status: 1
//                                     })
//                                 }
//                             }
//                         ).catch(
//                             (error) => {
//                                 console.log(error)

//                                 rej({
//                                     order_id: null,
//                                     msg: "Unable to place Order",
//                                     status: 0
//                                 })
//                             }
//                         )
//                 } catch (error) {
//                     console.log(error)
//                     rej({

//                         msg: "Internal server error",
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     paymentSuccess({ order_id, razorpay_response = null }) {
//         return new Promise(
//             async (res, rej) => {
//                 try {
//                     const verified = this.verifySignature(razorpay_response.razorpay_order_id, razorpay_response.razorpay_payment_id, razorpay_response.razorpay_signature);
//                     if (verified) {

//                         const orderDetails = await Order.findById(order_id);
//                         const transaction = new Transaction({
//                             orderId: order_id,
//                             userId: orderDetails.user_id,
//                             amount: orderDetails.order_total,
//                             type: orderDetails.payment_mode,
//                             payment_status: 1,
//                             razorpayResponse: razorpay_response
//                         })
//                         transaction.save()
//                             .then(
//                                 async () => {
//                                     await Order.updateOne({ _id: order_id },
//                                         {
//                                             transaction_id: transaction._id,
//                                             order_status: 2
//                                         })
//                                     res({
//                                         msg: "Order Place through online ",
//                                         status: 1,
//                                         order_id
//                                     })
//                                 }
//                             ).catch(
//                                 () => {
//                                     rej({
//                                         msg: "Unable to place order",
//                                         status: 0
//                                     })
//                                 }
//                             )
//                     } else {
//                         rej({
//                             msg: "Farzi Payment",
//                             status: 0
//                         })
//                     }
//                 } catch (error) {
//                     console.log(error)
//                     rej({

//                         msg: "Internal server error",
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     paymentFailed({ order_id, razorpay_response }) {
//         return new Promise(
//             async (res, rej) => {
//                 try {
//                     const orderDetails = await Order.findById(order_id);
//                     const transaction = new Transaction({
//                         orderId: order_id,
//                         userId: orderDetails.user_id,
//                         amount: orderDetails.order_total,
//                         type: orderDetails.payment_mode,
//                         payment_status: 0,
//                         razorpayResponse: razorpay_response
//                     })
//                     transaction.save()
//                         .then(
//                             () => {

//                                 res({
//                                     msg: "Order Payment Failed",
//                                     status: 0,
//                                     order_id
//                                 })
//                             }
//                         ).catch(
//                             () => {
//                                 rej({
//                                     msg: "Unable to place order",
//                                     status: 0
//                                 })
//                             }
//                         )


//                 } catch (error) {
//                     console.log(error)
//                     rej({

//                         msg: "Internal server error",
//                         status: 0
//                     })
//                 }
//             }
//         )
//     }

//     // ADD THIS NEW METHOD TO THE CLASS
//     getAllOrders() {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 const orders = await Order.find({})
//                     .populate('user_id', 'name email') // Populate user name and email
//                     .sort({ createdAt: -1 }); // Sort by most recent

//                 resolve({
//                     msg: "Orders found",
//                     status: 1,
//                     orders
//                 });
//             } catch (error) {
//                 reject({
//                     msg: "Internal server error",
//                     status: 0
//                 });
//             }
//         });
//     }

//     thankyouOrder(id) {
//         return new Promise(
//             async (resolve, reject) => {
//                 try {
//                     // console.log("first", id)
//                     if (id) {
//                         // console.log( id)
//                        const order = await Order.findById(id);
//                         // console.log(order)
//                         resolve(
//                             {
//                                 msg: "order found",
//                                 status: 1,
//                                 order
//                             }
//                         )
//                     }
//                 } catch (error) {
//                     () => {
//                         reject({
//                             msg: "Internal server error",
//                             status: 0
//                         })
//                     }
//                 }
//             })
//     }

// }

// module.exports = OrderController;
















const Order = require("../models/order");
const Cart = require("../models/cart");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require("../models/transaction");


const instance = new Razorpay({
    key_id: "rzp_test_R6I1rshvL0HKs9",
    key_secret: "0U0er1hbgulChdnKlinBaCIf",
});

class OrderController {
    async placeOrder({ user_id, shipping_details, order_total, payment_mode, product_details }) {
        try {
            if (!user_id || !shipping_details || !order_total || !payment_mode || !product_details) {
                return { status: 0, msg: "Invalid request data. All fields are required." };
            }

            const newOrder = new Order({
                user_id,
                shipping_details,
                order_total,
                payment_mode,
                product_details
            });

            const savedOrder = await newOrder.save();
            await Cart.deleteMany({ user_id });

            if (payment_mode === 2) {
                const options = {
                    amount: order_total * 100,
                    currency: "INR",
                    receipt: savedOrder._id.toString(),
                };
                const razor_order = await instance.orders.create(options);
                return { order_id: savedOrder._id, msg: "Your order has been placed (Online).", status: 1, razor_order };
            } else {
                return { order_id: savedOrder._id, msg: "Your order has been placed (COD).", status: 1 };
            }
        } catch (error) {
            console.error("Error in placeOrder:", error);
            return { msg: "Internal server error while placing order.", status: 0 };
        }
    }

    async paymentSuccess({ order_id, razorpay_response }) {
        try {
            const secret = process.env.RAZORPAY_KEY_SECRET;
            const body = razorpay_response.razorpay_order_id + "|" + razorpay_response.razorpay_payment_id;
            const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');

            if (expectedSignature === razorpay_response.razorpay_signature) {
                const orderDetails = await Order.findById(order_id);
                if (!orderDetails) return { status: 0, msg: "Order not found." };

                const transaction = new Transaction({
                    orderId: order_id,
                    userId: orderDetails.user_id,
                    amount: orderDetails.order_total,
                    type: orderDetails.payment_mode,
                    payment_status: true,
                    razorpayResponse: razorpay_response
                });
                const savedTransaction = await transaction.save();

                await Order.updateOne({ _id: order_id }, { transaction_id: savedTransaction._id, order_status: 2 });

                return { msg: "Payment successful and order updated.", status: 1, order_id };
            } else {
                return { msg: "Invalid payment signature. Payment verification failed.", status: 0 };
            }
        } catch (error) {
            console.error("Error in paymentSuccess:", error);
            return { msg: "Internal server error during payment verification.", status: 0 };
        }
    }

    async paymentFailed({ order_id, razorpay_response }) {
        try {
            const orderDetails = await Order.findById(order_id);
            if (!orderDetails) return { status: 0, msg: "Order not found." };

            const transaction = new Transaction({
                orderId: order_id,
                userId: orderDetails.user_id,
                amount: orderDetails.order_total,
                type: orderDetails.payment_mode,
                payment_status: false,
                razorpayResponse: razorpay_response
            });

            await transaction.save();
            return { msg: "Payment failure recorded.", status: 1, order_id };
        } catch (error) {
            console.error("Error in paymentFailed:", error);
            return { msg: "Internal server error while recording payment failure.", status: 0 };
        }
    }

    async thankyouOrder(id) {
        try {
            if (!id) return { status: 0, msg: "Order ID is required." };
            const order = await Order.findById(id);
            if (!order) return { status: 0, msg: "Order not found." };
            return { status: 1, msg: "Order found.", order };
        } catch (error) {
            console.error("Error in thankyouOrder:", error);
            return { msg: "Internal server error.", status: 0 };
        }
    }

    async getAllOrders() {
        try {
            const orders = await Order.find({})
                .populate('user_id', 'name email')
                .sort({ createdAt: -1 });
            return { msg: "Orders found", status: 1, orders };
        } catch (error) {
            return { msg: "Internal server error", status: 0 };
        }
    }
}

module.exports = OrderController;
