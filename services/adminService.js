const Sequelize = require('sequelize')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Op = Sequelize.Op
const Category = db.Category

const adminController = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      callback({ restaurant: restaurant })
    })
  },


  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId,
          viewCounts: 0
        }).then((restaurant) => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId,
        viewCounts: 0
      }).then((restaurant) => {
        callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },


  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                callback({ status: 'success', message: 'restaurant was successfully to update' })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          }).then((restaurant) => {
            callback({ status: 'success', message: 'restaurant was successfully to update' })
          })
        })
    }
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  },

  editUsers: (req, res, callback) => {
    return User.findAll({ where: { email: { [Op.ne]: 'root@example.com' } } }).then(users => {
      callback({ users: users })
    })
  },

  putUsers: (req, res, callback) => {
    return User.findByPk(req.params.id).then(user => {
      user.update({
        isAdmin: user.isAdmin ? false : true
      })
        .then(user => {
          const identity = user.isAdmin ? 'admin' : 'user'
          callback({ status: 'success', message: `${user.email} 身分已修改為 ${identity}` })
          // req.flash('success_messages', `${user.email} 身分已修改為 ${identity}`)
          // res.redirect('/admin/users')
        })
    })
  }
}

module.exports = adminController