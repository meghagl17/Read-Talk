"use server";

import Question from "../modals/question.modal"; 
import { connect } from "../db";

export async function createQuestion({ BookId, question, clerkUserID }) {
  try {
    await connect(); 
    const newQuestion = await Question.create({ BookId, question, clerkUserID });
    return JSON.parse(JSON.stringify(newQuestion));
  } catch (error) {
    throw new Error('Failed to create question');
  }
}

// Fetch questions by BookId
export async function getQuestionsByBookId(BookId) {
  try {
    await connect(); 
    const questions = await Question.find({ BookId }); 
    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    throw new Error('Failed to fetch questions');
  }
}

// Fetch question by QuestionID
export async function getQuestionsByQuestionId(questionId) {
  try {
    await connect(); 

    const question = await Question.findOne({ _id: questionId }).exec();

    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  } catch (error) {
    throw new Error('Failed to fetch questions');
  }
}