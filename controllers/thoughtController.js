const bodyParser = require("body-parser");
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
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.thoughtId })
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
  createThought(req, res) {
    Thought.create({
      thoughtText: body.thoughtText,
      username: body.username,
      userId: req.userId,
    })
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.userId },
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
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.thoughtId }, body, { new: true })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.thoughtId })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        return res.json(user);
      })
      .catch((err) => res.json(err));
  },
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.thoughtId },
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
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.thoughtId },
      { $pull: { reactions: { reactionId: req.reactionId } } },
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
