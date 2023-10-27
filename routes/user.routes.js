const Router = require('express')
const router= Router()
const {register,login,authenticate}=require('../controllers/user.auth')

router.post('/register',register)
router.post('/login',login)
router.get('/authenticate',authenticate)

module.exports=router
