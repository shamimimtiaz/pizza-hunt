const { Comment, Pizza } = require('../models');

const commentController = {
//add comment to pizza
addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } }, //using the $push method to add the comment's _id to the specific pizza we want to update.
          { new: true }  //because we passed the option of new: true, we're receiving back the updated pizza (the pizza with the new comment included).
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },
//remove comment
removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
    .then (deletedComment => {
        if(!deletedComment) {
            return res.status(404).json({ message: 'No comment with this id!'})
        }
        return Pizza.findOneAndUpdate (
            { _id: params.pizzaId },
            { $pull: { comments: params.commentId } },
        );
    })
    .then(dbPizzaData => {
        if(!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!'});
        }
        res.json(dbPizzaData);
    })
        .catch(err => res.json(err));

    }
};

module.exports = commentController;
