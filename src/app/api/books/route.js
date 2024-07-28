import axios from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

async function fetchBooks(query) {
  let url = `${BASE_URL}?maxResults=20&key=${API_KEY}`;

  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }

  console.log(query); // Log query parameter
  console.log(url); // Log constructed URL

  try {
    const response = await axios.get(url);
    return response.data.items || [];
  } catch (error) {
    throw new Error('Error fetching books from Google Books API');
  }
}

// Named export for the POST method
export async function POST(req) {
  console.log('books');
  try {
    const { query } = await req.json();
    const books = await fetchBooks(query);
    console.log(books);
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
