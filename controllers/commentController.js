const db = require('../models')
const Comment = db.Comment
let commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then((comment) => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  },

  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then((comment) => {
        const restaurantId = comment.RestaurantId
        comment.destroy()
          .then((comment) => {
            res.redirect(`/restaurants/${restaurantId}`)
          })
      })
  }
}
module.exports = commentController