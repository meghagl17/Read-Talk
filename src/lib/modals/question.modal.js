
import { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
   BookId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  clerkUserID: {
    type: String,
  },
});

const Question = models?.Question || model("Question", QuestionSchema);

export default Question;