import axios from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

async function fetchBooks(query, volumeId) {
  let url;

  console.log('Fetching books...');
  if (volumeId) {
    console.log(`Fetching book with volumeId: ${volumeId}`);
    url = `${BASE_URL}/${volumeId}?key=${API_KEY}`;
  } else {
    console.log('Fetching books with query:', query);
    url = `${BASE_URL}?maxResults=20&key=${API_KEY}`;
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
  }

  console.log(`Constructed URL: ${url}`);

  try {
    const response = await axios.get(url);
    console.log('API response:', response.data);

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
  console.log('Handling POST request to /api/books');

  try {
    const { query, volumeId } = await req.json();
    console.log(`Received query: ${query}, volumeId: ${volumeId}`);

    if (!query && !volumeId) {
      return NextResponse.json({ error: 'Either query or volumeId is required' }, { status: 400 });
    }

    const books = await fetchBooks(query, volumeId);

    console.log('Fetched books:', books);

    // Return a response with proper status
    return new Response(JSON.stringify(books), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in POST request:', error.message);

    // Log full error details
    return NextResponse.json({ error: error.message, details: error.stack }, { status: 500 });
  }
}
