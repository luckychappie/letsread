"use client"
import SmallChip from '@/app/components/SmallChip'
import DownloadIcon from '@mui/icons-material/Download';
import { Avatar, Box, Button, Container, Divider, Typography } from '@mui/material'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { Book } from '@/app/types/book';
import LoadingCard from '@/app/components/LoadingCard';
import { NextPage } from 'next';
import { useParams, useSearchParams } from 'next/navigation';
import LaunchIcon from '@mui/icons-material/Launch';
import { theme } from '../../../../../theme/Theme';

const PdfViewer = dynamic(() => import('@/app/components/PdfViewer'), { ssr: false })

const bookDetail: NextPage = () => {
  // const {id} = useParams()
  const searchParams = useSearchParams();
  let id = searchParams.get("id");
  const fileUrl = '/static/test1.pdf';
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
      .then((data: {book: Book}) => {
        setBook(data.book)

      }).catch((error: Error) => {
        setLoading(false)
        throw new Error('Network response was not ok')
      })

    await setLoading(false)
  }

  useEffect(() => {
    getBook()
    console.log('patam ' + id)
  }, [])


  return (
    <Container disableGutters sx={{ py: 2, bgcolor: '#FAFAFA' }}>
      {
        loading ? (
          <LoadingCard />
        ) : (


          <div>
            <div>
                <title>{book?.title}</title>
                <meta name="description" content={book?.description} />
                <meta name="keywords" content={`${book?.author_name}, ${book?.category_name}, ${book?.title}, Myanmar books, myanmar story, myanmar famous book, myanmar authors`} />
            </div>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
              <Avatar src={'/uploads/'+book?.cover_photo} variant="rounded" sx={{ width: 100, height: 100 }} alt={book?.title} />
              <div className='movie-info'>
                <h3 className='movie-title'> {book?.title} <SmallChip label='2017' /> </h3>
                <label className='movie-type'>{book?.category_name}</label>
                <label className='movie-actor'><b>Authors:</b> {book?.author_name}</label>
              </div>
            </Box>
            <Box sx={{ bgcolor: 'white', p: 1, mt: 1, mx: 1, fontSize: 12 }}>
              <strong> Description:</strong> {book?.description}
            </Box>
            <Box sx={{ p: 1, mt: 3, bgcolor: '#FFF' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src='/static/pdf.webp' sx={{ width: 100, height: 100 }} />
                <Box sx={{ textAlign: 'center', pl: 3 }}>
                  <Button color="secondary" startIcon={<DownloadIcon />} size="small" variant="contained" sx={{ height: 30, textTransform: 'capitalize', my: 1 }}>
                    <a href={'/uploads/files/'+book?.file} target="_blank" download>
                        Download
                    </a>
                  </Button>
                  <Typography sx={{ fontWeight: 500 }}>Download size: <span className='text-muted'>{book?.download_size}</span></Typography>
                </Box>
              </Box>
              <Divider sx={{my: 2}}> OR </Divider>
              <Box sx={{textAlign: 'center'}}>
                
                <Link href={`/pages/book/readBook?id=${book?.id}`}><Button endIcon={<LaunchIcon />} sx={{color:theme.palette.success.main ,fontSize: 14, fontWeight: 500 }}> Read Online </Button></Link>

              </Box>
            </Box>
          </div>
        )

      }
    </Container>
  )
}

export default bookDetail