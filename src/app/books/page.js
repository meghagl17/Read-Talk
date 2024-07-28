"use client";

import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const url = `/api/books`;
      console.log(url);
      const response = await axios.post(url, { query: searchQuery });
      console.log(response.data);
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div>
      <h1>Book Search</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for books..."
      />
      <button onClick={fetchBooks}>Search</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <h2>{book.volumeInfo.title}</h2>
              <p>by {book.volumeInfo.authors?.join(', ')}</p>
              <p>Published: {book.volumeInfo.publishedDate}</p>
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
