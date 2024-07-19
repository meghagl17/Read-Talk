import { useState, useEffect } from 'react';

export default function Book() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const res = await fetch(`/api/books?query=${searchQuery}`);
        console.log(res);
        // const data = await res.json();
        // setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
      setLoading(false);
    }

    fetchBooks();
  }, [searchQuery]);

  return (
    <div>
      <h1>Book Search</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for books..."
      />
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
