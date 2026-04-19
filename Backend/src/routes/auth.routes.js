//store all authenticated related api's

const {Router} = require('express')
const authRouter = Router()
const {
    registerUserController, 
    loginUserController, 
    logoutUserController,
    getMeController
    } = require('../Controllers/auth.controllers')
const authMiddleware = require('../middlewares/auth.middleware')


/**
 * @route POST /api/auth/register
 * @description registration of new user
 * @access public
 */

authRouter.post('/register',registerUserController)



/**
 * @route POST /api/auth/login
 * @description login existing user
 * @access public
 */
authRouter.post('/login',loginUserController)


/**
 * @route Get /api/auth/logout
 * @description clear the token and add the token to the blacklist
 * @access public
 */
authRouter.get('/logout', logoutUserController)



/**
 * @route Get /api/auth/get-me
 * @description get the details of the currently logged-in user
 * @access private
 */
authRouter.get('/get-me', authMiddleware, getMeController)

module.exports = authRouter