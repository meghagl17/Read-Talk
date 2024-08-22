import { NextResponse } from 'next/server';
import { createQuestion } from '../../../lib/actions/question.actions.js'

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
