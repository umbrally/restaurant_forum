const Sequelize = require('sequelize')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService.js')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Op = Sequelize.Op
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },


  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })

  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant
        })
      })
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  editUsers: (req, res) => {
    adminService.editUsers(req, res, (data) => {
      return res.render('admin/users', data)
    })
  },

  putUsers: (req, res) => {
    adminService.putUsers(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect('/admin/users')
      }
    })
  }
}

module.exports = adminController