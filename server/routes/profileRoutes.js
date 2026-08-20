const router = require("express").Router();
const { getProfile, upsertProfile } = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getProfile);
router.put("/", auth, upsertProfile);

module.exports = router;
