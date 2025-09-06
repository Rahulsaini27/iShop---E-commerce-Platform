const { Router } = require('express');
const AdminController = require('../controller/admin');
const OrderController = require('../controller/order');
const TransactionController = require('../controller/transaction');
// const isAdmin = require('../middleware/isAdmin'); // No longer needed

const AdminRouter = Router();

// Admin Login Route (Public)
AdminRouter.post("/login", (req, res) => {
    const result = new AdminController().login(req.body);
    result.then(success => res.send(success)).catch(error => res.status(401).send(error));
});
AdminRouter.get("/stats", (req, res) => {
    const adminController = new AdminController();
    adminController.getDashboardStats()
        .then(success => res.send(success))
        .catch(error => res.status(500).send(error));
});
// Admin routes are now unprotected on the backend for this UI demo
AdminRouter.get("/orders", (req, res) => { // Removed 'isAdmin' middleware
    const result = new OrderController().getAllOrders();
    result.then(success => res.send(success)).catch(error => res.status(500).send(error));
});

AdminRouter.get("/transactions", (req, res) => { // Removed 'isAdmin' middleware
    const result = new TransactionController().getAllTransactions();
    result.then(success => res.send(success)).catch(error => res.status(500).send(error));
});


module.exports = AdminRouter;