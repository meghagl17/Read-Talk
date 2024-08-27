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

import Spinner from '../../../components/loadingUi.jsx'

import { Anton } from 'next/font/google'

const pacifico = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const params = useParams();
  const [param, setParam] = useState({ bookId: '' });
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState();
  const [questions, setQuestions] = useState([]);

  const bookId = param.bookId;
  const router = useRouter()

  const fetchBook = async (bookId) => {
    try {
      const url = `/api/books`;
      const response = await axios.post(url, { volumeId: bookId });
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching Book:", error);
    }
  };

  const fetchQuestions = async (BookId) => {
    const res = await fetch(`/api/questions?BookId=${BookId}`);
    const data = await res.json();
  
    if (!res.ok) {
      setLoading(false);
      throw new Error(data.message || 'Something went wrong');
    }

    setQuestions(data.data);
    setLoading(false);
    // return data;
  };

  useEffect(() => {
    if(bookId){
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

    try {
      const response = await axios.post('/api/questions', {
        BookId: bookId,
        question: question,
        clerkUserID: userId, // Replace with actual Clerk user ID
      });

      router.push(`/answers/${book.id}/?` + createQueryString('questionId', response.data.data._id))
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
    }
  };

  useEffect(() => {
    setParam({ bookId: params.bookId });
  }, [params.bookId]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div
          className="flex flex-col lg:flex-row gap-8 p-4 lg:mx-36 mt-4 sm:p-6 min-h-[80vh]"
          style={{
            boxShadow: '0 16px 25px rgba(59, 74, 115, 0.3)',
          }}
        >
          {/* Book Information */}
          <div className="w-full sm:w-1/6 lg:w-1/3 bg-white shadow-md rounded-lg p-4 sm:p-6">
            {book && book.volumeInfo ? (
              <>
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-1/3 sm:w-1/2 lg:w-full h-auto object-cover mb-4 rounded-lg mx-auto"
                  />
                )}
                <h1 className="text-xl sm:text-md font-medium text-gray-800 mb-2 text-center lg:text-left" style={{ color: '#2a3a5a' }}>
                  {book.volumeInfo.title}
                </h1>
                <p className="text-base sm:text-sm text-gray-600 mb-2 text-center lg:text-left">
                  by {book.volumeInfo.authors?.join(', ')}
                </p>
                <p className="text-sm text-gray-500 mb-4 text-center lg:text-left">
                  Published: {book.volumeInfo.publishedDate}
                </p>
              </>
            ) : (
              <p>Loading book information...</p>
            )}
          </div>
  
          {/* Questions and Form */}
          <div className="flex-1 flex flex-col">
            {/* Questions Section */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 flex-1">
              <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-4 text-center lg:text-left" style={{ color: '#2a3a5a' }}>
                Discussion Questions
              </h2>
  
              {/* Existing Questions */}
              {questions.length > 0 ? (
                <div className="space-y-4 overflow-y-auto max-h-60 sm:max-h-80 pr-2">
                  {questions.map((question) => (
                    <div
                      key={question._id}
                      className="border border-gray-300 p-4 rounded-lg bg-gray-50"
                      style={{ boxShadow: '2px 2px 4px rgba(59, 74, 115, 0.3)' }}
                    >
                      <p className="text-sm font-medium text-gray-900 mb-2" style={{ color: '#2a3a5a' }}>
                        {question.question}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  {loading ? (
                    <p>loading questions...</p>
                  ) : (
                    <p className="text-gray-500">No questions posted yet. Be the first to start the discussion!</p>
                  )}
                </div>
              )}
            </div>
  
            {/* New Question Form */}
            <div
              className="bg-white rounded-lg p-4 sm:p-6"
              style={{
                boxShadow: '0 4px 8px rgba(59, 74, 115, 0.3)',
              }}
            >
              <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-4 text-center" style={{ color: '#2a3a5a' }}>
                Post a New Question
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  placeholder="Enter your question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="w-full h-20 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-sm placeholder:font-medium text-sm font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 text-[#3b4a73] rounded-lg transition text-xl sm:text-2xl font-medium ${
                    loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#c6e5f3] hover:bg-[#a1c9e7]'
                  } ${pacifico.className}`}
                >
                  Submit Question
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
