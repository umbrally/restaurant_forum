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

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

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

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

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