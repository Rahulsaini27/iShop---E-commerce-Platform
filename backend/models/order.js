
// const mongoose = require('mongoose');
// const OrderSchema = new mongoose.Schema(
//     {
//         user_id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//         },
//         shipping_details: {
//             type: Object,

//         },
//         product_details: [{
//             type: Object,
//         }],
//         order_total: {
//             type: Number,
//         },
//         payment_mode: {
//             type: Number,
//             enum: [1, 2],
//         },
//         order_status: {
//             type: Number,
//             enum: [1, 2, 3, 4, 5],
//             default: 1
//         },
//         transaction_id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Transaction',
//         }

//     },
//     {
//         timestamps: true
//     }
// )
// const Order = mongoose.model('Order', OrderSchema);

// module.exports = Order;





const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true // Add validation
        },
        shipping_details: {
            type: Object,
            required: true // Add validation
        },
        product_details: [{
            type: Object,
        }],
        order_total: {
            type: Number,
            required: true // Add validation
        },
        payment_mode: {
            type: Number,
            enum: [1, 2], // 1 for COD, 2 for Online
            required: true // Add validation
        },
        order_status: {
            type: Number,
            // 1: Pending, 2: Paid/Processing, 3: Shipped, 4: Delivered, 5: Canceled
            enum: [1, 2, 3, 4, 5],
            default: 1
        },
        transaction_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        }
    },
    {
        timestamps: true
    }
);
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;