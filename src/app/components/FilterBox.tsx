import { Autocomplete, Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, Divider, Grid, TextField, Typography } from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Author, Book, Category } from '../types/book'
import { BooksApiResponse } from '../page'


interface Props {
  setSelectedCategory: Dispatch<SetStateAction<Category | null>>
  setSelectedAuthor: Dispatch<SetStateAction<Author | null>>
  categories: Category[]
  authors: Author[]
  selectedAuthor: Author | null
  selectedCategory: Category | null
  filterBlog: () => void
  clearSearch: () => void
}

export default function FilterBox({ filterBlog, clearSearch, setSelectedCategory, setSelectedAuthor, selectedAuthor, selectedCategory, categories, authors }: Props) {
  const [popularBooks, setPoularBooks] = useState<Book[]>([])

  const clearFilter = () => {
    setSelectedCategory(null)
    setSelectedAuthor(null)
    clearSearch()
  }

  const getPopularBooks = async () => {
    try {
      const res = await fetch('/api/books/popular', {
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const response: BooksApiResponse = await res.json()
      await setPoularBooks(response.books)

    } catch (error) {
      console.log('Fetching Error ..', error)
    }
  }

  useEffect(() => {
    getPopularBooks()
  }, [])


  return (
    <Box sx={{ m: 1 }}>

      <Typography variant='body1' sx={{ fontSize: 14 }} >
        Welcome to my free e-books store. <br />
        You can read online and download your favourite books.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
        <Grid item xs={12}>
          <Autocomplete
            size='small'
            disablePortal
            id="combo-box-demo"
            options={authors}
            getOptionLabel={(option: Author) => option.author_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.author_name}
              </li>
            )}
            renderInput={(params) => <TextField name='authors_id' {...params} label="Select Author" variant="outlined" />}
            value={selectedAuthor}
            onChange={(event, newValue) => { setSelectedAuthor(newValue) }}
          />

        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>

        <Grid item xs={12}>
          <Autocomplete
            size='small'
            disablePortal
            options={categories}
            getOptionLabel={(option: Category) => option.category_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.category_name}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Select Category" variant="outlined" />}
            value={selectedCategory}
            onChange={(event, newValue) => { setSelectedCategory(newValue) }}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 5 }}>
        <Grid item xs={12} sx={{ display: 'flex' }}>
          <Button variant="outlined" onClick={clearFilter} sx={{ textTransform: 'capitalize', width: 120 }}>Clear Filter</Button>
          <Button type="submit" onClick={filterBlog} variant="contained" color="secondary" sx={{ textTransform: 'capitalize', ml: 1, width: 120 }}>Filter</Button>
        </Grid>
      </Grid>

      <Box>
        <Divider sx={{ mt: 6, mb: 2 }} >
          <Typography variant='subtitle1' sx={{ mt: 1, fontSize: 14 }} >
            Popular Books
          </Typography>
        </Divider>

        <Grid container spacing={1} sx={{ mt: 1, display: 'flex', height: '100%' }}>
          {
            popularBooks.map((pbook, key) => (
              <Grid key={key} item xs={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={`uploads/${pbook.cover_photo}`}
                      alt={pbook.title}
                      height="60"
                    />
                    <CardContent sx={{py: 0.5}}>
                      <Typography gutterBottom variant="h5" sx={{ fontSize: 13 }}>
                        {pbook.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          }
                  

        </Grid>
      </Box>
      
    </Box>
  )
}
