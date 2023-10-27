const {PrismaClient}= require('@prisma/client')
const prisma = new PrismaClient()
const imagekit = require('imagekit')
const path = require('path')

module.exports={
    updateProfile: async (req, res) => {
        try {
          const { first_name, last_name, brith_date } = req.body;
          if (!req.file) {
            return res.status(400).json({ success: false, message: 'Missing file', data: null });
          }
      
          const file = req.file.buffer.toString('base64');
      
          if (!first_name || !last_name || !brith_date) {
            return res.status(400).json({ success: false, message: 'Missing first_name, last_name, brith_date, profile_picture', data: null });
          }
      
          const { url } = await imagekit.upload({
            file,
            fileName: `${Date.now()}-${req.file.originalname}-profile`,
            folder: '/images',
          });
      
          const user = await prisma.user.update({
            where: {
              id: req.user.id,
            },
            data: {
              profile: {
                upsert: {
                  create: {
                    first_name,
                    last_name,
                    brith_date: new Date(brith_date).toISOString(),
                    profile_picture: url,
                  },
                  update: {
                    first_name,
                    last_name,
                    brith_date: new Date(brith_date).toISOString(),
                    profile_picture: url,
                  },
                },
              },
            },
          });
          delete user.password;
          res.status(201).json({ success: true, message: 'User updated', data: user });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
}