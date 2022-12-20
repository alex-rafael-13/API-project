const express = require('express')
const router = express.Router()

//Import models
 const { User } = require('../../db/models');
//Import functions from utils/auth.js
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js'); 
router.use(restoreUser);
//Testing the router
router.post('/test', function(req, res){    
    res.json({requestBody: req.body});
});

//--------------- User auth routers: ---------------//
//GET /api/set-token-cookie
router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'Demo-lition'
        }
    });
    setTokenCookie(res, user);
    return res.json({
        user: user
    })
});

//GET /api/restore-user
router.get('/restore-user', (req, res) => {
    return res.json(req.user);
})

//GET /api/require-auth
router.get('/require-auth', requireAuth, (req,res) => {
    return res.json(req.user)
})
//------------------------------------------------------------//

module.exports = router
