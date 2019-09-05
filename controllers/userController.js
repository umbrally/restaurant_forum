// 註冊 登入

const bcrypt = require('bcrypt-nodejs')
const imgur = require('imgur-node-api')
const sequelize = require('sequelize')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userService = require('../services/userService')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.render('profile', data)
    })
  },

  editUser: (req, res) => {
    if (Number(req.params.id) !== req.user.id) {
      req.flash('error_messages', "you are only allowed to edit your profile")
      return res.redirect(`/users/${req.params.id}`)
    }
    else {
      return User.findByPk(req.params.id).then(user => {
        res.render('profileEdit', { editUser: user })
      })
    }

  },

  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      if (data['status'] === 'error_1') {
        req.flash('error_messages', data['message'])
        return res.redirect(`/users/${req.params.id}`)
      }
      if (data['status'] === 'error_2') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect(`/users/${req.user.id}`)
      }
    })
  },

  addFavorite: (req, res) => {
    userService.addFavorite(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },

  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },

  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },

  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.render('topUser', data)
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },

  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  }
}

module.exports = userController