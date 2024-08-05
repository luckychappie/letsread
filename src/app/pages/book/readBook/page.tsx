"use client"
import { Box, Container } from '@mui/material'
import React, { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { Book } from '@/app/types/book';
import LoadingCard from '@/app/components/LoadingCard';
import { NextPage } from 'next';
import { useParams, useSearchParams } from 'next/navigation';

const PdfViewer = dynamic(() => import('@/app/components/PdfViewer'), { ssr: false })

const ReadBook: NextPage = () => {
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [book, setBook] = useState<Book | null>(null)

    const getBook = async () => {

        await setLoading(true)

        await fetch(`/api/books/detail?id=${id}`, {
            cache: "no-store",
        })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json()
            })
            .then((data: { book: Book }) => {
                setBook(data.book)

            }).catch((error: Error) => {
                setLoading(false)
                throw new Error('Network response was not ok')
            })

        await setLoading(false)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const bookId = params.get("id");
            setId(bookId);
          }
      }, []);

      useEffect(() => {
        if (id) {
          getBook()
        }
    
      }, [id])


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Container disableGutters sx={{ bgcolor: '#FAFAFA' }}>
                {
                    loading ? (
                        <LoadingCard />
                    ) : (
                        <div>
                            <Box>
                                <Box sx={{ bgcolor: '#FFF' }}>
                                    <PdfViewer bookId={book?.id ?? 0} fileUrl={'/uploads/files/' + book?.file} />
                                </Box>
                            </Box>
                        </div>
                    )

                }
            </Container>
        </Suspense>
    )
}

export default ReadBook