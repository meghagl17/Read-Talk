'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { UserButton, useAuth } from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const params = useParams();
  const [param, setParam] = useState({ bookId: '' });
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState();

  const bookId = param.bookId;

  const fetchBook = async (bookId) => {
    setLoading(true);
    try {
      const url = `/api/books`;
      console.log(url);
      const response = await axios.post(url, { volumeId: bookId });
      console.log(response.data);
      setBook(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching Book:", error);
    }
  };

  useEffect(() => {
    if(bookId){
      fetchBook(bookId);
    }
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/questions', {
        BookId: bookId,
        question: question,
        clerkUserID: userId, // Replace with actual Clerk user ID
      });

      console.log(response.data);
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setParam({ bookId: params.bookId });
  }, [params.bookId]);

  return (
    <div className="flex *:max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {book && book.volumeInfo ? (<Card key={book.id} className="bg-white shadow-md rounded-lg overflow-hidden">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="w-full h-auto object-cover"
          />
        )}
        <CardHeader className="p-4 border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-800 mb-1">{book.volumeInfo.title}</CardTitle>
          <CardDescription className="text-gray-600">
            <p>by {book.volumeInfo.authors?.join(', ')}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <CardDescription className="text-gray-500">
            Published: {book.volumeInfo.publishedDate}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 border-t border-gray-200">
          {/* Optional footer content */}
        </CardFooter>
      </Card>) : (null)}
      
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Submit Your Question
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } transition duration-300 ease-in-out`}
          >
            {loading ? 'Submitting...' : 'Submit New Question'}
          </button>
        </form>
      </div>
    </div>
  );  
}
