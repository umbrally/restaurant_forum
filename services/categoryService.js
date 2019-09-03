const db = require('../models')
const Category = db.Category


const categoryController = {
  getCategories: (req, res, callback) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({ categories: categories, category: category })
          })
      } else {
        callback({ categories: categories })
      }
    })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.max('id').then(categoryId => {
        Category.create({
          id: categoryId + 1,
          name: req.body.name
        })
          .then((category) => {
            callback({ status: 'success', message: '' })
          }).catch(err => { return console.log(err) })
      })


    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              callback({ status: 'success', message: '' })
            })
        })
    }
  },

  // deleteCategory: (req, res) => {
  //   return Category.findByPk(req.params.id)
  //     .then((category) => {
  //       category.destroy()
  //         .then((category) => {
  //           res.redirect('/admin/categories')
  //         })
  //     })
  // }
}

module.exports = categoryController