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
      throw new Error(data.message || 'Something went wrong');
    }

    console.log(data.data);
    setQuestions(data.data);
    // return data;
  };

  const goToQuestion = async (bookId) => {
    setQuestions([]);
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
  <div>
    <div className={styles.searchContainer}>
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for books..."
        className={styles.searchInput}
      />
      <button onClick={fetchBooks} className={styles.searchButton}>Search</button>
    </div>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className={styles.gridContainer}>
        {books.map((book) => (
          <Card key={book.id} className={styles.card}>
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
            )}
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>{book.volumeInfo.title}</CardTitle>
              <CardDescription className={styles.cardDescription}>
                <p>by {book.volumeInfo.authors?.join(', ')}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <CardDescription className={styles.cardDescriptions}>
                Published: {book.volumeInfo.publishedDate}
              </CardDescription>
            </CardContent>
            <CardFooter className={styles.cardFooter}>
              <button
                onClick={() => handleDialogOpen(book)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                More Info
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )}

      <Dialog open={openDialog} onOpenChange={(open) => { 
        setOpenDialog(open);
        if (!open) handleDialogClose(); 
      }}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <div className="flex flex-col items-center">
            {currentBook?.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={currentBook.volumeInfo.imageLinks.thumbnail}
                alt={currentBook.volumeInfo.title}
                className="w-32 h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{currentBook?.volumeInfo.title}</h2>
            <p className="text-gray-600 mb-2">by {currentBook?.volumeInfo.authors?.join(', ')}</p>
            <p className="text-gray-500 mb-4">Published: {currentBook?.volumeInfo.publishedDate}</p>
          </div>

          <DialogHeader className="border-t border-gray-200 pt-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">Discussion Questions</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Questions from fellow book lovers
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-40 overflow-y-auto">
            {questions.length > 0 ? (
              questions.map((question) => (
                <button key={question._id} onClick={() => goToAnswer(currentBook?.id, question._id)} className="p-4 mb-2 border border-gray-200 rounded-lg shadow-sm">
                  {question.question}
                </button>
              ))
            ) : (
              <p className="text-gray-500">Be the first one to post a question!</p>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => goToQuestion(currentBook?.id)}
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              New Question
            </button>
          </div>
        </DialogContent>
      </Dialog>
  </div>
);
}