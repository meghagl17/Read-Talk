'use client';

import { useState, useEffect } from 'react';
import React, { useCallback } from 'react';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  const [questions, setQuestions] = useState([]);

  const bookId = param.bookId;
  const router = useRouter()

  const fetchBook = async (bookId) => {
    setLoading(true);
    try {
      const url = `/api/books`;
      console.log(url);
      const response = await axios.post(url, { volumeId: bookId });
      console.log(response.data);
      setBook(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching Book:", error);
    }
  };

  const fetchQuestions = async (BookId) => {
    console.log(BookId);
    const res = await fetch(`/api/questions?BookId=${BookId}`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    console.log(data.data);
    setQuestions(data.data);
    setLoading(false);
    // return data;
  };

  useEffect(() => {
    if(bookId){
      setLoading(true);
      fetchBook(bookId);
      fetchQuestions(bookId);
    }
  }, [bookId]);

  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )

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
      console.log(response.data.data._id);
      console.log(`/answers/${book.id}/?` + createQueryString('questionId', response.data.data._id));
      router.push(`/answers/${book.id}/?` + createQueryString('questionId', response.data.data._id))
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
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-100 min-h-[80vh]">
      {/* Book Information Section */}
      <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6">
        {book && book.volumeInfo ? (
          <>
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="w-full h-auto object-cover mb-4 rounded-lg"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{book.volumeInfo.title}</h1>
            <p className="text-lg text-gray-600 mb-2">by {book.volumeInfo.authors?.join(', ')}</p>
            <p className="text-md text-gray-500 mb-4">Published: {book.volumeInfo.publishedDate}</p>
          </>
        ) : (
          <p>Loading book information...</p>
        )}
      </div>
  
      {/* Questions Section */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Discussion Questions</h2>
  
          {/* Existing Questions */}
          {questions.length > 0 ? (
            <div className="space-y-4 overflow-y-auto max-h-80 pr-2">
              {questions.map((question) => (
                <div
                  key={question._id}
                  className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <p className="text-lg font-medium text-gray-900 mb-2">{question.question}</p>
                </div>
              ))}
              
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              {loading ? <p>loading questions...</p> : <p className="text-gray-500">No questions posted yet. Be the first to start the discussion!</p>}
            </div>
          )}
        </div>
  
        {/* New Question Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Post a New Question</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              placeholder="Enter your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full h-20 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-lg transition ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Submit Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
