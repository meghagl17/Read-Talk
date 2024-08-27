import axios from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

async function fetchBooks(query, volumeId) {
  let url;

  if (volumeId) {
    url = `${BASE_URL}/${volumeId}?key=${API_KEY}`;
  } else {
    url = `${BASE_URL}?maxResults=20&key=${API_KEY}`;
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
  }

  try {
    const response = await axios.get(url);
    // Return data directly for volumeId
    if (volumeId) {
      return response.data;
    }
    // For query-based fetch, return items or an empty array
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching books:', error.message);
    throw new Error('Error fetching books from Google Books API');
  }
}

// Named export for the POST method
export async function POST(req) {
  try {
    const { query, volumeId } = await req.json();

    if (!query && !volumeId) {
      return NextResponse.json({ error: 'Either query or volumeId is required' }, { status: 400 });
    }

    const books = await fetchBooks(query, volumeId);

    // Return a response with proper status
    return new Response(JSON.stringify(books), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in POST request:', error.message);

    // Log full error details
    return NextResponse.json({ error: error.message, details: error.stack }, { status: 500 });
  }
}

export async function GET(req) {
  const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
  const API_KEY = process.env.GOOGLE_BOOKS_API_KEY; // Assuming you're using environment variables

  try {
    // Build the URL to fetch random books with a fixed query (since Google Books API requires the `q` parameter)
    const url = `${GOOGLE_BOOKS_API_URL}?q=random&maxResults=20&startIndex=${Math.floor(Math.random() * 1000)}&key=${API_KEY}`;

    // Fetch books from Google Books API
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching data from Google Books API: ${data.error?.message || 'Unknown error'}`);
    }

    // Return a response with the fetched books
    return new Response(JSON.stringify(data.items), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in GET request:', error.message);

    // Return an error response with proper details
    return NextResponse.json({ error: error.message, details: error.stack }, { status: 500 });
  }
}
