const router = require("express").Router();
const { getQuestions, submitAssessment, getResult } = require("../controllers/assessmentController");
const auth = require("../middleware/authMiddleware");

router.get("/questions", auth, getQuestions);
router.post("/submit", auth, submitAssessment);
router.get("/result", auth, getResult);

module.exports = router;
