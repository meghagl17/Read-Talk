'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter(); 
  const { isLoaded, userId } = useAuth();
  const params = useParams();
  const [param, setParam] = useState({ bookId: '' });

  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionId, setQuestionId] = useState();

  let bookId = param.bookId;

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
      throw new Error(data.message || 'Something went wrong');
    }

    console.log(data.data);
    setAnswers(data.data);
    // return data;
  };

  useEffect(() => {
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
      setNewAnswer('');
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
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
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Book Info Section */}
      <div className="flex items-center gap-4 bg-[#f8fafb] px-4 min-h-14 justify-between">
        {book && book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="w-14 h-20 object-cover rounded"
          />
        )}
        <div>
          <h2 className="text-xl text-gray-800">{book?.volumeInfo.title}</h2>
        </div>
      </div>
  
      {/* Main Question Placeholder */}
      {currentQuestion && <h2 className="text-[#0e141b] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">{currentQuestion.question}</h2>}
  
      {/* Chat Section */}
      <div className="flex flex-col space-y-4">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-3">
          {answers.length > 0 ? (
            answers.map((answer) => (
              <div key={answer._id} className="flex items-center space-x-3">
                {/* User Info */}
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src="https://via.placeholder.com/40" // Placeholder image
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Message Container */}
                <div className="flex flex-col space-y-1">
                  {/* User Name */}
                  <div className="text-left text-[#4f7296] text-[13px] font-normal leading-normal max-w-[360px]">Bob</div>
                  {/* Message Bubble */}
                  <div className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-[#e8edf3] text-[#0e141b]">
                    <p>{answer.answer}</p>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <p className="text-gray-400">Be the first one to add to the discussion!</p>
          )}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Textbox and Send Button */}
        <form onSubmit={handleSubmit} className="flex space-x-2 p-2 rounded-xl bg-[#e8edf3]">
          {/* Textarea */}
          <textarea
            placeholder="Type your message..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            required
            className="flex-1 min-w-0 resize-none overflow-hidden rounded-xl text-[#0e141b] placeholder:text-[#4f7296] px-4 py-2 bg-[#e8edf3] border-none focus:outline-none focus:ring-0 text-base font-normal leading-normal"
          />
          
          {/* Button and Additional Controls */}
          <div className="flex items-center border-none bg-[#e8edf3] rounded-r-xl">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center p-1.5 rounded-xl h-8 px-4 bg-[#368ce7] text-[#f8fafb] text-sm font-medium leading-normal ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500'
              }`}
            >
              Send
            </button>
          </div>
        </form>
      </div>
  
      {/* Other Questions Section */}
      <div className="flex flex-col space-y-4 p-4 rounded-lg">
        <h3 className="text-[#0e141b] text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
          Other Questions
        </h3>
        {questions.length > 0 ? (
          <div className="space-y-2 overflow-y-auto max-h-80">
            {questions.map((question) => (
              <button
                onClick={() => goToQuestion(question._id)}
                key={question._id}
                className="flex items-center gap-4 bg-[#f8fafb] px-4 min-h-[72px] py-2 rounded-lg shadow-sm"
              >
                {book && book.volumeInfo.imageLinks?.thumbnail && <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-14 h-14"
                  style={{ backgroundImage: `url(${book.volumeInfo.imageLinks.thumbnail})` }}
                ></div>}
                <div className="flex flex-col justify-center">
                {book && book.volumeInfo.imageLinks?.thumbnail && <p className="text-[#4f7296] text-sm font-normal leading-normal line-clamp-2">
                    {book.volumeInfo.title}
                  </p>}
                  <p className="text-[#0e141b] text-base font-medium leading-normal line-clamp-1">
                    {question.question}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[#4f7296] text-sm">No other questions posted yet. Be the first to start the discussion!</p>
        )}
      </div>
    </div>
  );
  
}