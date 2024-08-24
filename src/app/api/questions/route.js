import { NextResponse } from 'next/server';
import { createQuestion, getQuestionsByBookId, getQuestionsByQuestionId } from '../../../lib/actions/question.actions.js'

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
    const { searchParams } = new URL(request.url);
    const BookId = searchParams.get('BookId');
    const QuestionId = searchParams.get('QuestionId');

    console.log("QUESTION ID BEING POSTED NOW");
    console.log(QuestionId);

    if (BookId) {
      const questions = await getQuestionsByBookId(BookId);
      if (!questions.length) {
        return NextResponse.json({ message: 'No questions found for the given BookId' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Questions fetched successfully!', data: questions }, { status: 200 });

    } else if (QuestionId) {
      console.log("QUESTION ID FOUND");
      console.log(QuestionId);
      const question = await getQuestionsByQuestionId(QuestionId);
      if (!question) {
        return NextResponse.json({ message: 'No question found for the given QuestionId' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Question fetched successfully!', data: question }, { status: 200 });

    } else {
      return NextResponse.json({ message: 'BookId or QuestionId is required' }, { status: 400 });
    }

  } catch (error) {
    console.error('Failed to fetch data:', error);
    return NextResponse.json({ message: 'Failed to fetch data', error: error.message }, { status: 500 });
  }
}