const express = require('express')
const router = express.Router()

//Importing setTokenCookir, restoreUser, and User
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

//POST /api/session
router.post('/', async (req, res, next) => {
    const { credential, password } = req.body

    const user = await User.login({credential, password});

    if(!user){
        const err = new Error('Login Failed');
        err.status = 401;
        err.title = 'Login Failed'
        err.errors = ['The provided creadentials were invalid']
        return next(err);
    }

    //Set token cookie for logged in user
    await setTokenCookie(res, user)

    return res.json({
        user: user
    })
})










module.exports = router
