const router = require("express").Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

router.route("/").get(getThoughts);

router.route("/:userId").post(createThought);

router
  .route("/:userId/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router.route("/:userId/:thoughtId/reactions/").put(addReaction);

router
  .route("/:userId/:thoughtId/reactions/:reactionId")
  .delete.apply(deleteReaction);

module.exports = router;
