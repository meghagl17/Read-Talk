import { NextResponse } from 'next/server';
import { createAnswer, getAnswersByQuestionId } from '../../../lib/actions/answer.actions.js'

export async function POST(request) {
  try {
    const { questionId, clerkUserID, answer, name } = await request.json();
    const newAnswer = await createAnswer({ questionId, clerkUserID, answer, name });
    return NextResponse.json({ message: 'Answer created successfully!', data: newAnswer }, { status: 201 });
  } catch (error) {
    console.error('Failed to create answer:', error);
    return NextResponse.json({ message: 'Failed to create answer', error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const QuestionId = searchParams.get('QuestionId');
    if (!QuestionId) {
      return NextResponse.json({ message: 'QuestionId is required' }, { status: 400 });
    }

    // Fetch the questions by BookId using the action
    const answers = await getAnswersByQuestionId(QuestionId);

    if (!answers.length) {
      return NextResponse.json({ message: 'No answers found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'answers fetched successfully!', data: answers }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch answers:', error);
    return NextResponse.json({ message: 'Failed to fetch answers', error: error.message }, { status: 500 });
  }
}