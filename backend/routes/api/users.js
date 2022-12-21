const express = require('express')

//Importing setToken, requireAuth, and User model
const { setToken, requireAuth, setTokenCookie, restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models')

//initiating router
const router = express.Router()

//POST Creating a new user
router.post('/', async (req, res) => {
    const { email, password, username } = req.body;
    const user = await User.signup({email, username, password});

    await setTokenCookie(res, user);

    return res.json({
        user: user
    })
})

module.exports = router
