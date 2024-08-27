"use server";

import Answer from "../modals/answer.modal";
import { connect } from "../db";

export async function createAnswer({ questionId, clerkUserID, answer, name }) {
  try {
    await connect();
    const newAnswer = await Answer.create({ questionId, clerkUserID, answer, name });
    return JSON.parse(JSON.stringify(newAnswer));
  } catch (error) {
    throw new Error('Failed to create answer');
  }
}

// Fetch questions by BookId
export async function getAnswersByQuestionId(questionId) {
  try {
    await connect();
    const answers = await Answer.find({ questionId });
    return JSON.parse(JSON.stringify(answers));
  } catch (error) {
    throw new Error('Failed to fetch answers');
  }
}