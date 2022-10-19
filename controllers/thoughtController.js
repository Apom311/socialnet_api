const { Thought, User } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err);
      });
  },
  getSingleThought({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select("-__v")
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought with this ID" });
        }
        return res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err);
      });
  },
  createThought({ params, body }, res) {
    Thought.create({
      thoughtText: body.thoughtText,
      username: body.username,
      userId: params.userId,
    })
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $addToSet: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        return res.json(user);
      })
      .catch((err) => res.json(err));
  },
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        return res.json(user);
      })
      .catch((err) => res.json(err));
  },
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No thought with this ID" });
          return;
        }
        return res.json(user);
      })
      .catch((err) => res.json(err));
  },
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No reaction with that ID" });
          return;
        }
        return res.json(user);
      })
      .catch((err) => res.json(err));
  },
};
