import { NextResponse } from 'next/server';
import { createQuestion, getQuestionsByBookId } from '../../../lib/actions/question.actions.js'

export async function POST(request) {
  try {
    const { BookId, question, clerkUserID } = await request.json();

    // Create a new question using the action
    const newQuestion = await createQuestion({ BookId, question, clerkUserID });

    return NextResponse.json({ message: 'Question created successfully!', data: newQuestion }, { status: 201 });
  } catch (error) {
    console.error('Failed to create question:', error);
    return NextResponse.json({ message: 'Failed to create question', error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    console.log(request);
    const { searchParams } = new URL(request.url);
    const BookId = searchParams.get('BookId');
    console.log(BookId);
    if (!BookId) {
      return NextResponse.json({ message: 'BookId is required' }, { status: 400 });
    }

    // Fetch the questions by BookId using the action
    const questions = await getQuestionsByBookId(BookId);

    if (!questions.length) {
      return NextResponse.json({ message: 'No questions found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Questions fetched successfully!', data: questions }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json({ message: 'Failed to fetch questions', error: error.message }, { status: 500 });
  }
}