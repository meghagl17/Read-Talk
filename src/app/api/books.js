import axios from 'axios';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export default async function handler(req, res) {
  const { query } = req.query;
  let url = `${BASE_URL}?maxResults=20&key=${API_KEY}`;

  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }

  try {
    const response = await axios.get(url);
    const books = response.data.items || [];
    // console.log(books);
    res.status(200).send(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books from Google Books API' });
  }
}
