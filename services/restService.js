const db = require('../models')
const sequelize = require('sequelize')
const Op = sequelize.Op
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

let restController = {
  getRestaurants: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description ? r.dataValues.description.substring(0, 50) : r.dataValues.description,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        callback({
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }]
    }).then(restaurant => {
      restaurant.update({
        viewCounts: restaurant.viewCounts + 1
      })
        .then(restaurant => {
          const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
          const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
          callback({
            isFavorited: isFavorited,
            isLiked: isLiked,
            restaurant: restaurant
          })
        })
    })
  },

  getFeeds: (req, res, callback) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        callback({
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },

  getDashboard: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Comment, Category] })
      .then(restaurant => {
        callback({ restaurant: restaurant })
      })
  },

  getTopRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      include: {
        model: User, as: 'FavoritedUsers'
      }
    })
      .then(restaurants => {
        const userFavoritedRestaurants = req.user.FavoritedRestaurants
        restaurants = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description ? restaurant.dataValues.description.substring(0, 50) : restaurant.dataValues.description,
          FavoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: userFavoritedRestaurants.map(d => d.id).includes(restaurant.id)
        }))
        const topRestaurants = restaurants.sort((a, b) => b.FavoritedCount - a.FavoritedCount).filter(restaurant => { return restaurant.FavoritedCount > 0 }).slice(0, 10)
        callback({ topRestaurants: topRestaurants })
      })
      .catch(err => { console.log(err) })

  }
}
module.exports = restController