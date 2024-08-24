"use server";

import Question from "../modals/question.modal"; // Adjust the path based on your file structure
import { connect } from "../db";

export async function createQuestion({ BookId, question, clerkUserID }) {
  try {
    await connect(); // Ensure the database connection is established
    const newQuestion = await Question.create({ BookId, question, clerkUserID });
    return JSON.parse(JSON.stringify(newQuestion));
  } catch (error) {
    console.log(error);
    throw new Error('Failed to create question');
  }
}

// Fetch questions by BookId
export async function getQuestionsByBookId(BookId) {
  try {
    await connect(); // Ensure the database connection is established
    const questions = await Question.find({ BookId }); // Find questions with matching BookId
    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch questions');
  }
}

// Fetch question by QuestionID
export async function getQuestionsByQuestionId(questionId) {
  try {
    await connect(); // Ensure the database connection is established

    // if (!mongoose.Types.ObjectId.isValid(questionId)) {
    //   throw new Error('Invalid questionId');
    // }

    const question = await Question.findOne({ _id: questionId }).exec();

    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch questions');
  }
}