const Sequelize = require('sequelize')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../../services/adminService.js')
const db = require('../../models')
const Restaurant = db.Restaurant
const User = db.User
const Op = Sequelize.Op
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },


  // createRestaurant: (req, res) => {
  //   Category.findAll().then(categories => {
  //     return res.render('admin/create', {
  //       categories: categories
  //     })
  //   })

  // },

  // postRestaurant: (req, res) => {
  //   if (!req.body.name) {
  //     req.flash('error_messages', "name didn't exist")
  //     return res.redirect('back')
  //   }

  //   const { file } = req // equal to const file = req.file
  //   if (file) {
  //     imgur.setClientID(IMGUR_CLIENT_ID);
  //     imgur.upload(file.path, (err, img) => {
  //       return Restaurant.create({
  //         name: req.body.name,
  //         tel: req.body.tel,
  //         address: req.body.address,
  //         opening_hours: req.body.opening_hours,
  //         description: req.body.description,
  //         image: file ? img.data.link : null,
  //         CategoryId: req.body.categoryId,
  //         viewCounts: 0
  //       }).then((restaurant) => {
  //         req.flash('success_messages', 'restaurant was successfully created')
  //         return res.redirect('/admin/restaurants')
  //       })
  //     })
  //   } else {
  //     return Restaurant.create({
  //       name: req.body.name,
  //       tel: req.body.tel,
  //       address: req.body.address,
  //       opening_hours: req.body.opening_hours,
  //       description: req.body.description,
  //       image: null,
  //       CategoryId: req.body.categoryId,
  //       viewCounts: 0
  //     }).then((restaurant) => {
  //       req.flash('success_messages', 'restaurant was successfully created')
  //       return res.redirect('/admin/restaurants')
  //     })
  //   }
  // },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  // editRestaurant: (req, res) => {
  //   return Restaurant.findByPk(req.params.id).then(restaurant => {
  //     Category.findAll().then(categories => {
  //       return res.render('admin/create', {
  //         categories: categories,
  //         restaurant: restaurant
  //       })
  //     })
  //   })
  // },

  // putRestaurant: (req, res) => {
  //   if (!req.body.name) {
  //     req.flash('error_messages', "name didn't exist")
  //     return res.redirect('back')
  //   }

  //   const { file } = req
  //   if (file) {
  //     imgur.setClientID(IMGUR_CLIENT_ID);
  //     imgur.upload(file.path, (err, img) => {
  //       return Restaurant.findByPk(req.params.id)
  //         .then((restaurant) => {
  //           restaurant.update({
  //             name: req.body.name,
  //             tel: req.body.tel,
  //             address: req.body.address,
  //             opening_hours: req.body.opening_hours,
  //             description: req.body.description,
  //             image: file ? img.data.link : restaurant.image,
  //             CategoryId: req.body.categoryId
  //           })
  //             .then((restaurant) => {
  //               req.flash('success_messages', 'restaurant was successfully to update')
  //               res.redirect('/admin/restaurants')
  //             })
  //         })
  //     })
  //   } else {
  //     return Restaurant.findByPk(req.params.id)
  //       .then((restaurant) => {
  //         restaurant.update({
  //           name: req.body.name,
  //           tel: req.body.tel,
  //           address: req.body.address,
  //           opening_hours: req.body.opening_hours,
  //           description: req.body.description,
  //           image: restaurant.image,
  //           CategoryId: req.body.categoryId
  //         }).then((restaurant) => {
  //           req.flash('success_messages', 'restaurant was successfully to update')
  //           res.redirect('/admin/restaurants')
  //         })
  //       })
  //   }
  // },

  // deleteRestaurant: (req, res) => {
  //   return Restaurant.findByPk(req.params.id)
  //     .then((restaurant) => {
  //       restaurant.destroy()
  //         .then((restaurant) => {
  //           res.redirect('/admin/restaurants')
  //         })
  //     })
  // },

  // editUsers: (req, res) => {
  //   return User.findAll({ where: { email: { [Op.ne]: 'root@example.com' } } }).then(users => {
  //     return res.render('admin/users', { users: users })
  //   })
  // },

  // putUsers: (req, res) => {
  //   return User.findByPk(req.params.id).then(user => {
  //     user.update({
  //       isAdmin: user.isAdmin ? false : true
  //     })
  //       .then(user => {
  //         const identity = user.isAdmin ? 'admin' : 'user'
  //         req.flash('success_messages', `${user.email} 身分已修改為 ${identity}`)
  //         res.redirect('/admin/users')
  //       })
  //   })
  // }
}

module.exports = adminController