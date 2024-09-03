const { encryptPassword, decryptPassword } = require("../helper");
const User = require("../models/user");

class UserController {

    register(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const existingUser = await User.findOne({ email: data.email });
                    if (existingUser) {
                        reject({
                            msg: "Email Already used",
                            status: 0
                        })
                    } else {
                        const user = new User({
                            name: data.name,
                            email: data.email,
                            password: encryptPassword(data.password),
                        })
                        user.save()
                            .then(
                                (success) => {
                                    resolve({
                                        msg: "User Added",
                                        status: 1,
                                        user
                                    })
                                }
                            ).catch(
                                () => {
                                    reject({
                                        msg: "Unable to add user",
                                        status: 0
                                    })
                                }
                            )

                    }
                } catch (error) {
                    () => {
                        reject({
                            msg: "Internal server error",
                            status: 0
                        })
                    }
                }
            })
    }

    login(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const user = await User.findOne({ email: data.email })
                    if (user) {
                        if (decryptPassword(user.password) == data.password) {
                            resolve({
                                msg: "Login succesfullyyyyy",
                                status: 1,
                                user
                            })
                        } else {
                            reject({
                                msg: "PassWord galat hai",
                                status: 0
                            })
                        }
                    } else {
                        reject({
                            msg: "This email does not exits",
                            status: 0
                        })
                    }
                } catch (error) {
                    () => {
                        reject({
                            msg: "Internal server error",
                            status: 0
                        })
                    }
                }

            }
        )
    }




}
module.exports = UserController;
