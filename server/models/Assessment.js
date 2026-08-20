const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        questionId: Number,
        value: Number
      }
    ],
    scores: {
      software: { type: Number, default: 0 },
      data: { type: Number, default: 0 },
      uiux: { type: Number, default: 0 },
      marketing: { type: Number, default: 0 },
      cyber: { type: Number, default: 0 },
      business: { type: Number, default: 0 }
    },
    recommendations: [
      {
        domain: String,
        score: Number,
        description: String,
        icon: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
