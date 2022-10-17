const { Schema, model } = require("mongoose");
const Reaction = require("./Reaction");

const thoughtSchema = new Schema({
  thoughtText: {
    String,
    required: true,
    max_length: 280,
    min_length: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [Reaction],
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
