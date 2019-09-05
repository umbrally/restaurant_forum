// 註冊 登入

const bcrypt = require('bcrypt-nodejs')
const imgur = require('imgur-node-api')
const sequelize = require('sequelize')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userController = {
  getUser: (req, res, callback) => {
    User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] },
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
      ],

    }).then(user => {
      user.isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      const commentRestaurantsId = []
      user.Comments.forEach(function (comment) {
        if (commentRestaurantsId.indexOf(comment.RestaurantId) === -1) {
          commentRestaurantsId.push(comment.RestaurantId)
        }
      })
      user.commentRestaurants = []
      commentRestaurantsId.forEach(id => {
        user.commentRestaurants.push(user.Comments.find(comment => {
          return comment.RestaurantId === id
        }))
      })
      callback({ checkUser: user, owner: req.user.id })
    })
  },


  putUser: (req, res, callback) => {
    if (Number(req.params.id) !== req.user.id) {
      return callback({ status: 'error_1', message: "you are only allowed to edit other's profile" })
    }

    if (!req.body.name) {
      return callback({ status: 'error_2', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            image: file ? img.data.link : user.image
          })
            .then(user => {
              callback({
                status: 'success', message: 'user was successfully updated'
              })
            })
        })
      })
    }
    else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          image: user.image
        })
          .then(user => {
            callback({
              status: 'success', message: 'user was successfully updated'
            })
          })
      })

    }
  },

  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((favorite) => {
        callback({ status: 'success', message: '' })
      })
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((favorite) => {
            callback({ status: 'success', message: '' })
          })
      })
  },

  addLike: (req, res, callback) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(like => {
        callback({ status: 'success', message: '' })
      })
  },

  removeLike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        like.destroy()
          .then(like => {
            callback({ status: 'success', message: '' })
          })
      })
  },

  getTopUser: (req, res, callback) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).map((user, index) => ({
        ...user,
        ranking: index + 1,
      }))
      callback({ users: users })
    })
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        callback({ status: 'success', message: '' })
      })
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = userController