'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import Spinner from '../../../components/loadingUi.jsx'

import { CircleUserRound } from 'lucide-react';

import { Pacifico } from 'next/font/google'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Home() {
  const router = useRouter(); 
  // const { isLoaded, userId } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const params = useParams();
  const [param, setParam] = useState({ bookId: '' });

  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionId, setQuestionId] = useState();
  

  let bookId = param.bookId;

  const fetchBook = async (bookId) => {
    try {
      const url = `/api/books`;
      console.log(url);
      const response = await axios.post(url, { volumeId: bookId });
      console.log(response.data);
      setBook(response.data);
    } catch (error) {
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
    // return data;
  };

  const fetchQuestion = async (QuestionId) => {
    console.log(QuestionId);
    const res = await fetch(`/api/questions?QuestionId=${QuestionId}`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    console.log(data);
    console.log(data.data);
    setCurrentQuestion(data.data);
    // return data;
  };

  const fetchAnswers = async (questionId) => {
    console.log(questionId);
    const res = await fetch(`/api/answers?QuestionId=${questionId}`);
    const data = await res.json();
  
    if (!res.ok) {
      setAnswers([]);
      setLoading(false);
      throw new Error(data.message || 'Something went wrong');
    }

    console.log(data.data);
    setAnswers(data.data);
    setLoading(false);
    // return data;
  };

  useEffect(() => {
    setLoading(true);
    if(bookId && questionId){
      fetchBook(bookId);
      fetchQuestions(bookId);
      fetchQuestion(questionId);
      fetchAnswers(questionId);
    }
  }, [bookId, questionId]);

  useEffect(() => {
    setParam({ bookId: params.bookId });
  }, [params.bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answer = newAnswer
    try {
      const response = await axios.post('/api/answers', {
        questionId: questionId, // This should match the schema's questionId
        clerkUserID: user.id,
        answer: newAnswer, // This is the user's answer text // This is the Clerk user ID, as required by the schema
        name: user.firstName,
      });
      
      console.log(response.data);
      console.log(answers);
      setAnswers(prevAnswers => [...prevAnswers, response.data.data]);
      setNewAnswer('');
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
    }
  }

  const goToQuestion = async (newQuestionId) => {
    console.log("in this function");
    console.log(questionId);
    setQuestionId(newQuestionId);
    console.log(questionId);
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('questionId');
    if (id) {
      setQuestionId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("calling this useEffect");
    if (questionId) {
      fetchAnswers(questionId);
    }
  }, [questionId]);

  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages container
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [answers]);

  return (
    <div className="w-full mx-auto p-4 h-[calc(100vh-90px)] flex flex-col">
      {loading ? (< Spinner />) : (
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Book Info Section */}
        <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg border border-gray-200 flex flex-col h-full"
          style={{
            boxShadow: '0 10px 17px rgba(59, 74, 115, 0.3)' // Adjust shadow color
          }}>
          <div className="flex items-center gap-2 mb-4">
            {book && book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="w-28 h-40 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-lg font-medium text-gray-800 " style={{ color: '#2a3a5a' }}>{book?.volumeInfo.title}</h2>
              <h2 className="text-sm font-medium text-gray-500">By: {book?.volumeInfo.authors?.join(', ')}</h2>
            </div>
          </div>
  
          {/* Other Questions Section */}
          <div className="flex-col space-y-4 flex-1 overflow-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: '#2a3a5a' }}>Other Questions</h3>
            {questions.length > 0 ? (
              <div className="space-y-2 overflow-y-auto max-h-full">
                {questions.map((question) => (
                  <button
                    onClick={() => goToQuestion(question._id)}
                    key={question._id}
                    className="flex items-center gap-4 bg-gray-50 px-4 py-3 rounded-lg shadow-sm w-full max-w-md h-16"
                  >
                    <div className="flex flex-col justify-center w-full">
                      <p className="text-gray-800 text-base font-medium" style={{ color: '#2a3a5a' }}>
                        {question.question}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No other questions posted yet. Be the first to start the discussion!</p>
            )}
          </div> 
        </div>
  
        {/* Chat Box */}
        
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg border border-gray-200 flex flex-col h-full"
          style={{
            boxShadow: '0 10px 17px rgba(59, 74, 115, 0.3)' // Adjust shadow color
          }}>
          {/* Main Question Placeholder */}
          {currentQuestion && (
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: '#2a3a5a' }}
            >
              {currentQuestion.question}
            </h2>
          )}
  
          <hr className="my-4 border-t border-gray-300" />
  
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {answers.length > 0 ? (
              answers.map((answer) => (
                <div key={answer._id} className="flex items-center space-x-3">
                  {/* User Info */}
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <CircleUserRound strokeWidth={1.3} className="w-full h-full object-cover"></CircleUserRound>
                  </div>
                  {/* Message Container */}
                  <div className="flex flex-col space-y-1">
                    {/* User Name */}
                    <div className="text-left text-blue-600 text-xs font-normal max-w-[360px]">{answer.name}</div>
                    {/* Message Bubble */}
                    <div className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-gray-200 text-gray-800">
                      <p>{answer.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-gray-400">Be the first one to add to the discussion!</p>
            )}
            <div ref={messagesEndRef} />
          </div>
  
          {/* Textbox and Send Button */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-100"
          >
            {/* Textarea */}
            <textarea
              placeholder="Type your message..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              required
              className="flex-1 min-w-0 resize-none overflow-hidden rounded-lg text-gray-800 px-4 py-2 bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 placeholder:text-sm placeholder:font-medium text-sm font-medium"
            />
            
            {/* Button and Additional Controls */}
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center p-6 rounded-lg h-8 px-8 text-md font-medium ${
                loading
                  ? 'bg-[#a1c9e7] cursor-not-allowed'  // lighter shade for disabled state
                  : 'bg-[#c6e5f3] hover:bg-[#a1c9e7]'
              } ${pacifico.className}`} // Apply custom font if needed
              style={{ color: '#3b4a73' }} // Text color
            >
              Send
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
  
  
}