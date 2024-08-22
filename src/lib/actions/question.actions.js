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
