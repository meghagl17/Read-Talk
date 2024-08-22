"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

import { useParams } from 'next/navigation'
import { UserButton, auth, useAuth } from "@clerk/nextjs"


export default function Home() {

    const { isLoaded, userId } = useAuth();

    const params = useParams();
    const [param, setParam] = useState({bookId: ''});

    const [question, setQuestion] = useState('');

    const bookId = param.bookId;

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // setLoading(true);
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
        //   setLoading(false);
        }
    };

    useEffect(() => {
        setParam({bookId: params.bookId})
    }, []);

    return(
        <form onSubmit={handleSubmit}>
            <textarea
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            />
            <button type="submit">Submit New Question</button>
            <>{userId}</>
        </form>
    );
}