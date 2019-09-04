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

  editUsers: (req, res) => {
    adminService.editUsers(req, res, (data) => {
      return res.json(data)
    })
  },

  putUsers: (req, res) => {
    adminService.putUsers(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = adminController