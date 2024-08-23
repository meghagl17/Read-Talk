
import { time } from "console";
import { Schema, model, models } from "mongoose";

const AnswerSchema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  clerkUserID: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  }
});

const Answer = models?.Answer || model("Answer", AnswerSchema);

export default Answer;