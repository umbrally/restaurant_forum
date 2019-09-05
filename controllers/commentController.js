const db = require('../models')
const commentService = require('../services/commentService.js')
const Comment = db.Comment


let commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect(`/restaurants/${req.body.restaurantId}`)
      }

    })
  },

  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect(`/restaurants/${data.restaurantId}`)
      }
    })
  }
}
module.exports = commentController