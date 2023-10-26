const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    register: async (req,res,next)=>{
        try {
            let {email,password} = req.body
            
            if(!email||!password){
                return res.status(400).json({
                    status:false,
                    message:'Bad Request',
                    error:'Email and password is required',
                    data:null
                })
            }
            let hashPassword = await bcrypt.hash(password,10)
            let data = await prisma.user.create({
                data:{
                    email,
                    password:hashPassword
                }
            })
            res.status(201).json({
                status:true,
                message:'OK',
                error:null,
                data
            })
        } catch (error) {
            next(error)
        }
    },

    login:async(req,res,next)=>{
        try {
            let {email,password} = req.body
            let data = await prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(!data){
                return res.status(400).json({
                    status:false,
                    message:'Bad Request',
                    error:'Email not found',
                    data:null
                })
            }
            let isValidPassword = await bcrypt.compare(password,data.password)
            if(!isValidPassword){
                return res.status(400).json({
                    status:false,
                    message:'Bad Request',
                    error:'Password is wrong',
                    data:null
                })
            }
            let token = jwt.sign({id:data.id},process.env.JWT_SECRET)
            res.status(200).json({
                status:true,
                message:'OK',
                error:null,
                data:{
                    token
                }
            })
        } catch (error) {
            next(error)
        }
    },

    authenticate:async(req,res, next)=>{
        try {
            let {token} = req.headers
            if(!token){
                return res.status(400).json({
                    status:false,
                    message:'Bad Request',
                    error:'Token is required',
                    data:null
                })
            }
            let decode = jwt.verify(token,process.env.JWT_SECRET)
            let data = await prisma.user.findUnique({
                where:{
                    id:decode.id
                },
                select:{
                    id:true,
                    username:true,
                    email:true
                }
            })
            if(!data){
                return res.status(400).json({
                    status:false,
                    message:'Bad Request',
                    error:'User not found',
                    data:null
                })
            }
            req.user = data
            next()
        } catch (error) {
            next(error)
        }
    }
}