const Assessment = require("../models/Assessment");
const questions = require("../data/questions");
const careers = require("../data/careers");

exports.getQuestions = async (req, res) => {
  res.json(questions.map(({ id, text }) => ({ id, text })));
};

exports.submitAssessment = async (req, res) => {
  try {
    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    if (answers.length !== questions.length) {
      return res.status(400).json({ message: `Please answer all ${questions.length} questions.` });
    }

    const scores = { software: 0, data: 0, uiux: 0, marketing: 0, cyber: 0, business: 0 };

    answers.forEach((answer) => {
      const q = questions.find((item) => item.id === Number(answer.questionId));
      const value = Math.max(1, Math.min(5, Number(answer.value)));
      if (q) q.domains.forEach((domain) => { scores[domain] += value; });
    });

    const maxPossible = 5 * 20;
    const recommendations = Object.entries(scores)
      .map(([key, score]) => ({
        domain: careers[key].domain,
        score: Math.round((score / maxPossible) * 100),
        description: careers[key].description,
        icon: careers[key].icon,
        key
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const assessment = await Assessment.create({
      userId: req.userId,
      answers,
      scores,
      recommendations
    });

    res.status(201).json({ assessmentId: assessment._id, scores, recommendations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResult = async (req, res) => {
  const assessment = await Assessment.findOne({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(assessment || null);
};
