const express = require('express');
const router = express.Router()
const {getUsers, register, getUserData, login} = require('../../controllers/userController');


router.route("/users").get(getUsers).post(register);

router.route('/user').get(getUserData);

router.route("/users/auth").post(login)


module.exports = router;