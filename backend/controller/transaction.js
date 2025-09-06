const Transaction = require("../models/transaction");

class TransactionController {
    getAllTransactions() {
        return new Promise(async (resolve, reject) => {
            try {
                const transactions = await Transaction.find({})
                    .populate('userId', 'name email') // Populate user details
                    .populate('orderId', 'order_total') // Populate order details
                    .sort({ createdAt: -1 }); // Sort by most recent

                resolve({
                    msg: "Transactions found",
                    status: 1,
                    transactions
                });
            } catch (error) {
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }
}

module.exports = TransactionController;