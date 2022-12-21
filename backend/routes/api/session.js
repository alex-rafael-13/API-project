const express = require('express')
const router = express.Router()

//Importing setTokenCookir, restoreUser, and User
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

//POST Login
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
});

//DELETE Logout
router.delete('/',(_req, res) => {
    res.clearCookie('token');
    return res.json({message: 'Logout Successful'})
})

//GET Restore session user
router.get('/', restoreUser, (req, res) => {
    const { user } = req;
    // console.log(user)
    if(user){
        return res.json({
            user: user.toSafeObject()
        });
    } 
    else return res.json({user: null})
})


module.exports = router
