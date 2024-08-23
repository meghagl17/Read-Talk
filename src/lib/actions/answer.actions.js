"use server";

import Answer from "../modals/answer.modal"; // Adjust the path based on your file structure
import { connect } from "../db";

export async function createAnswer({ questionId, clerkUserID, answer }) {
  try {
    await connect(); // Ensure the database connection is established
    const newAnswer = await Answer.create({ questionId, clerkUserID, answer });
    return JSON.parse(JSON.stringify(newAnswer));
  } catch (error) {
    console.log(error);
    throw new Error('Failed to create answer');
  }
}

// Fetch questions by BookId
export async function getAnswersByQuestionId(questionId) {
  try {
    await connect(); // Ensure the database connection is established
    const answers = await Answer.find({ questionId }); // Find questions with matching BookId
    return JSON.parse(JSON.stringify(answers));
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch answers');
  }
}