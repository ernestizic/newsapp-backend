const express = require('express');
const router = express.Router()
const {getUsers, register, getUserData, auth} = require('../../controllers/userController');


router.route("/users").get(getUsers).post(register);

router.route('/user').get(getUserData);

router.route("/users/auth").post(auth)


module.exports = router;