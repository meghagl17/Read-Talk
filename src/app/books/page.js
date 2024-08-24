"use client";

import styles from './styles.module.css';
import React, { useCallback } from 'react';
import { UserButton, auth, useAuth } from "@clerk/nextjs"
import { useRouter, useSearchParams } from 'next/navigation';  // Use next/navigation for app directory routing

import axios from 'axios';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"

import { Input } from "../../components/ui/input"

import Spinner from '../../components/loadingUi.jsx'
import { LibraryBig } from 'lucide-react';
import { CirclePlus } from 'lucide-react';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"

export default function Home() {
  const router = useRouter(); 

  const { isLoaded, userId } = useAuth();

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingDialog, setLoadingDialog] = useState(false);

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

  const fetchQuestions = async (BookId) => {
    console.log(BookId);
    const res = await fetch(`/api/questions?BookId=${BookId}`);
    const data = await res.json();
  
    if (!res.ok) {
      setLoadingDialog(false);
      throw new Error(data.message || 'Something went wrong');
    }

    console.log(data.data);
    setQuestions(data.data);
    setLoadingDialog(false);
    // return data;
  };

  const goToQuestion = async (bookId) => {
    // setQuestions([]);
    router.push(`/question/${bookId}`);
  }

  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )

  const goToAnswer = async (bookId, questionId) => {
    router.push(`/answers/${bookId}/?` + createQueryString('questionId', questionId))
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  const handleDialogOpen = (book) => {
    setLoadingDialog(true);
    setCurrentBook(book);
    setOpenDialog(true);
    fetchQuestions(book.id);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setQuestions([]); // Clear questions when dialog closes
    setCurrentBook(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r">
      {/* Search Bar */}
      <div className="flex justify-center items-center mb-8">
  <div className="relative w-full max-w-md">
    {/* Input Field */}
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search for books..."
      className="w-full px-4 py-2 min-w-[450px] rounded-l-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 box-border placeholder:text-gray-500 placeholder:text-sm placeholder:font-medium text-sm font-medium"
    />
    
    {/* Search Button */}
    <button
      onClick={fetchBooks}
      className="flex items-center justify-center absolute right-0 top-0 h-full px-4 py-2 rounded-r-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 space-x-2"
    >
      <span>Search</span>
      <LibraryBig className="w-5 h-5" /> {/* Adjust size if needed */}
    </button>
  </div>
</div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex flex-col items-center text-center border border-gray-300 rounded-lg p-3 bg-white shadow-md transition-transform transform hover:scale-105 max-w-xs"
            >
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-28 h-40 object-cover mb-3"  // Adjusted size for smaller images
                />
              )}
              <div className="mb-2">
                <h2 className="text-lg font-bold text-gray-800">{book.volumeInfo.title}</h2>  
                <p className="text-gray-600 text-sm">by {book.volumeInfo.authors?.join(', ')}</p> 
              </div>
              <p className="text-gray-500 text-sm mb-3">Published: {book.volumeInfo.publishedDate}</p> 
              <button
                onClick={() => handleDialogOpen(book)}
                className="text-sm font-medium bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"  // Adjusted padding
              >
                More Info
              </button>
            </div>
          ))}
        </div>
      )}


      <Dialog open={openDialog} onOpenChange={(open) => { 
        setOpenDialog(open);
        if (!open) handleDialogClose(); 
      }}>
        { !loadingDialog ? (
          <DialogContent className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <div className="flex flex-col items-center">
              {currentBook?.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={currentBook.volumeInfo.imageLinks.thumbnail}
                  alt={currentBook.volumeInfo.title}
                  className="w-32 h-30 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-medium text-gray-800 mb-1 text-center">{currentBook?.volumeInfo.title}</h2>
              <p className="text-lg font-medium text-gray-600 mb-2">by {currentBook?.volumeInfo.authors?.join(', ')}</p>
              <p className="text-sm font-medium text-gray-500 mb-0">Published: {currentBook?.volumeInfo.publishedDate}</p>
            </div>

            <div className="mt-4 max-h-40 overflow-y-auto">
              {questions.length > 0 ? (
                questions.map((question) => (
                  <div key={question._id} className="flex gap-4 bg-white px-4 py-3 justify-between mb-2 shadow-sm">
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-[#181411] text-md font-medium leading-normal">{question.question}</p>
                    </div>
                    <div className="shrink-0">
                      <button onClick={() => goToAnswer(currentBook?.id, question._id)} className="text-[#181411] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-4 bg-white px-4 py-3 justify-between mb-2 shadow-sm">
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-[#181411] text-base font-medium leading-normal text-center">
                      Be the first one to post a discussion question!
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex px-4 py-3">
              <button
                onClick={() => goToQuestion(currentBook?.id)}
                className="flex items-center justify-center min-w-[90px] max-w-[480px] cursor-pointer overflow-hidden rounded-xl h-12 px-20 bg-blue-500 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg font-medium truncate">Post New Question</span>
                  <CirclePlus className="w-5 h-5" /> {/* Adjust size if needed */}
                </span>
              </button>
            </div>
          </DialogContent>
        ) : (
          <DialogTitle className="text-xl font-semibold text-gray-800">Loading...</DialogTitle>
        )}
      </Dialog>
    </div>
  );
}

const DualRingLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-4 border-blue-300 border-solid rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
      </div>
    </div>
  );
};