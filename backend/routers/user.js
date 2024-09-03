const { Router } = require('express');
const UserController = require('../controller/user');
const UserRouter = Router();

UserRouter.post(
    "/register",
    (req, res) => {
        const result = new UserController().register(req.body);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);

            })
    }
)
UserRouter.post(
    "/login",
    (req, res) => {
        const result = new UserController().login(req.body);
        result.then(
            (success) => {
                res.send(success)
            }
        ).catch(
            (error) => {
                res.send(error)
            }
        )

    }
)


module.exports = UserRouter;