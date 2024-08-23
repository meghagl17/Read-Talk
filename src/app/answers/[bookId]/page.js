'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
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

  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
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

  const fetchAnswers = async (questionId) => {
    console.log(questionId);
    const res = await fetch(`/api/answers?QuestionId=${questionId}`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    console.log(data.data);
    setAnswers(data.data);
    // return data;
  };

  useEffect(() => {
    if(bookId){
      fetchBook(bookId);
      fetchAnswers(questionId);
    }
  }, [bookId]);

  useEffect(() => {
    setParam({ bookId: params.bookId });
  }, [params.bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const answer = newAnswer
    try {
      const response = await axios.post('/api/answers', {
        questionId: questionId, // This should match the schema's questionId
        clerkUserID: userId,
        answer: newAnswer, // This is the user's answer text // This is the Clerk user ID, as required by the schema
      });
      
      console.log(response.data);
      console.log(answers);
      setAnswers(prevAnswers => [...prevAnswers, response.data.data]);
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  }

  const searchParams = useSearchParams()
  const questionId = searchParams.get('questionId')

  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages container
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [answers]);

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg border border-gray-200">
      <div className="flex flex-row space-x-6">
        {/* Book Info Section */}
        <div className="flex-none w-1/3 bg-white rounded-lg shadow-md p-4">
          {book && book.volumeInfo.imageLinks?.thumbnail && (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              className="w-full h-auto object-cover rounded-lg mb-4"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{book?.volumeInfo.title}</h2>
          <p className="text-gray-700">by {book?.volumeInfo.authors?.join(', ')}</p>
          <p className="text-gray-500 mt-2">Published: {book?.volumeInfo.publishedDate}</p>
        </div>

        {/* Messages Section */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[500px] bg-gray-50 p-4 rounded-lg shadow-inner pr-20">
            {answers.length > 0 ? (
              answers.map((answer) => (
                <div key={answer._id} className="flex items-start space-x-4 mb-4">
                  {/* User Info */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src="https://via.placeholder.com/48" // Placeholder image
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Message Bubble */}
                  <div className="flex-1 bg-blue-100 text-gray-800 rounded-lg shadow-lg p-4 relative">
                    <div className="absolute top-[-12px] left-[-12px] transform -translate-x-1/2 w-0 h-0 border-r-8 border-r-blue-100 border-t-8 border-t-transparent border-b-8 border-b-transparent"></div>
                    <div className="font-semibold text-gray-900 mb-1 absolute top-[-24px] left-[-10px] text-xs">
                      Bob
                    </div>
                    <div>{answer.answer}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Be the first one to add to the discussion!</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Textbox and Send Button */}
          <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2 bg-white p-4 rounded-lg shadow-lg">
            <textarea
              placeholder="Type your message..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              required
              className="flex-1 h-16 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-24 py-2 text-white font-semibold rounded-lg ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } transition duration-300 ease-in-out`}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}