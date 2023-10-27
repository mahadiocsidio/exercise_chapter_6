const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    register: async (req,res,next)=>{
        try {
            let {email,password} = req.body

            let userExist = await prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(userExist){
                return res.status(400).json({
                    status:false,
                    message:'Bad Request',
                    error:'Email already exist',
                    data:null
                })
            }

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
                data: {data}
            })
        } catch (err) {
            next(err)
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
        } catch (err) {
            next(err)
        }
    },

    authenticate:async (req, res) => {
        try {
          if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
          const user = await prisma.user.findUnique({
            where: {
              id: req.user.id,
            },
            include: {
              profile: true,
            },
          });
          delete user.password;
          res.status(200).json({ success: true, message: 'User Authenticated', data: user });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
}