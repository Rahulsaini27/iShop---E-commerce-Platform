// const { Router } = require('express');
// const OrderController = require('../controller/order');
// const OrderRouter = Router();

// OrderRouter.post(
//     "/place-order",
//     (req, res) => {
//         const result = new OrderController().placeOrder(req.body);
//         result.then(
//             (success) => {
//                 res.send(success);
//             }
//         ).catch(
//             (error) => {
//                 res.send(error);

//             })
//     }
// )


// OrderRouter.post(
//     "/payment-success",
//     (req, res) => {
//         const result = new OrderController().paymentSuccess(req.body);
//         result.then(
//             (success) => {
//                 res.send(success);
//             }
//         ).catch(
//             (error) => {
//                 res.send(error);

//             })
//     }
// )


// OrderRouter.post(
//     "/payment-failed",
//     (req, res) => {
//         const result = new OrderController().paymentFailed(req.body);
//         result.then(
//             (success) => {
//                 res.send(success);
//             }
//         ).catch(
//             (error) => {
//                 res.send(error);

//             })
//     }
// )



// OrderRouter.get(
//     "/:id?",
//     (req, res) => {
//         // console.log(req.params.id)
//         const result = new OrderController().thankyouOrder(req.params.id);
//         result.then(
//             (success) => {
//                 res.send(success);
//             }
//         ).catch(
//             (error) => {
//                 res.send(error);

//             })
//     }
// )

// module.exports = OrderRouter;










const { Router } = require('express');
const OrderController = require('../controller/order');
const OrderRouter = Router();
const orderController = new OrderController(); // Create one instance

OrderRouter.post("/place-order", async (req, res) => {
    try {
        const result = await orderController.placeOrder(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send({ msg: "An unexpected error occurred.", status: 0 });
    }
});

OrderRouter.post("/payment-success", async (req, res) => {
    try {
        const result = await orderController.paymentSuccess(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send({ msg: "An unexpected error occurred.", status: 0 });
    }
});

OrderRouter.post("/payment-failed", async (req, res) => {
    try {
        const result = await orderController.paymentFailed(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send({ msg: "An unexpected error occurred.", status: 0 });
    }
});

OrderRouter.get("/:id?", async (req, res) => {
    try {
        const result = await orderController.thankyouOrder(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).send({ msg: "An unexpected error occurred.", status: 0 });
    }
});

module.exports = OrderRouter;