"use client"
import { AppBar, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Divider, Drawer, Grid, IconButton, List, Slide, Stack, TextField, Toolbar, Typography } from "@mui/material"
import TuneIcon from '@mui/icons-material/Tune'
import BookListItem from "./components/BookListItem"
import React, { useEffect, useRef, useState } from "react"
import { Author, Book, Category } from "./types/book"
import Loading from "./components/Loading"
import { TransitionProps } from '@mui/material/transitions';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import DebounceSearchField from "./components/DebounceSearchField"
import FilterBox from "./components/FilterBox"
import { grey } from "@mui/material/colors"
import LoadingCard from "./components/LoadingCard"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface BooksApiResponse {
  books: Book[],
  total: number
}

export interface CategoryApiResponse {
  categories: Category[]
}

export interface AuthorApiResponse {
  authors: Author[]
}

export default function Home() {

  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [sidebarLoading, setSidebarLoading] = useState<boolean>(true)
  const [totalBooks, setTotalBooks] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const initialFetchDone = useRef(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);


  const getBooks = async () => {

    await setLoading(true)
    console.log('page = ' + page)

    await fetch(`/api/books?page=${page}&search=${search}&categories_id=${selectedCategory?.id}&authors_id=${selectedAuthor?.id}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json()
      })
      .then((data: BooksApiResponse) => {
        if (!data.books) {
          books.length = data.total
        }
        setBooks((prevItems) => page === 1 ? data.books : [...prevItems, ...data.books])
        setTotalBooks(data.total)
        if (data.total > books.length) {
          setPage((prevPage) => prevPage + 1);
        }
      }).catch((error: Error) => {
        setLoading(false)
        throw new Error('Network response was not ok')
      })

    await setLoading(false)
  }

  const getCategories = async () => {
    setSidebarLoading(true)
    try {
      const res = await fetch('/api/categories', {
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const response: CategoryApiResponse = await res.json()
      await setCategories(response.categories)
    } catch (error) {
      console.log('Fetching Error ..', error)
    }
    setSidebarLoading(false)
  }

  const getAuthors = async () => {
    setSidebarLoading(true)
    try {
      const res = await fetch('/api/authors', {
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const response: AuthorApiResponse = await res.json()
      await setAuthors(response.authors)
    } catch (error) {
      console.log('Fetching Error ..', error)
    }
    setSidebarLoading(false)
  }

  const handleInputSearch = (value: string) => {
    setSearch(value)
    resetPagination()
    setTriggerSearch(true)
  }

  const resetPagination = () => {
    setPage(1)
    setTotalBooks(0)
  }

  const handleSearch = () => {
    resetPagination()
    setTriggerSearch(true)

  }

  useEffect(() => {
    if (triggerFetch) {
      getBooks();
      setTriggerFetch(false)
    }
  }, [page, triggerFetch])

  const handleScroll = async () => {
    console.log(totalBooks + '>' + books.length)
    if (totalBooks > books.length && (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && !loading)) {
      await getBooks()
    }
  }

  const handleCloseFilterModel = () => {
    setOpenFilter(false);
  }

  useEffect(() => {
    if (triggerSearch) {
      getBooks()
      setTriggerSearch(false)
    }

  }, [search, triggerSearch])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll])


  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      getBooks()
      getCategories()
      getAuthors()
    }

  }, [])

  return (
    <Box sx={{ px: 1, py: 2 }}>

      <Drawer
        elevation={2}
        variant="permanent"
        sx={{
          display: { md: 'block', xs: 'none', sm: 'none' },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: '23%', boxSizing: 'border-box' },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#fbfbfb",
          }

        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', px: 2, bgcolor: '#fbfbfb', }}>
          {
            sidebarLoading ? (
              <LoadingCard isSidebar={true} />
            )
              : (
                <FilterBox filterBlog={handleSearch} clearSearch={handleSearch} setSelectedAuthor={setSelectedAuthor} setSelectedCategory={setSelectedCategory} selectedAuthor={selectedAuthor} selectedCategory={selectedCategory} authors={authors} categories={categories} />

              )
          }
        </Box>
      </Drawer>
      <Box component="main">
        <Grid container >
          <Grid item xs={12} sm={12} md={3}></Grid>
          <Grid item xs={12} sm={12} md={9} sx={{ px: { md: '12%' } }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              <DebounceSearchField
                placeholder="Type in here…"
                debounceTimeout={1000}
                handleDebounce={handleInputSearch}
              />
              <IconButton onClick={() => setOpenFilter(true)} sx={{ display: { md: 'none' } }} size="small" aria-label="Filter books" color="secondary"><TuneIcon /></IconButton>
              {/* <Button color="success" size="small" onClick={handleSearch} disableElevation variant="contained" sx={{ height: 30, textTransform: 'capitalize' }}>Search</Button> */}
            </Stack>
            <Box >
              {
                loading ? (
                  <Loading count={9} />
                )
                  : (

                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      {
                        books.map((book, key) => (
                          <Box key={key}>
                            <BookListItem id={book.id} img={book.cover_photo} title={book.title} label={book.category_name} secondLabel={book.author_name} />
                            <Divider component="li" />
                          </Box>
                        ))
                      }

                    </List>


                  )
              }
              {loading && <p>Loading...</p>}
              {(totalBooks === books.length && !loading) && <Typography sx={{ textAlign: 'center' }}>No more items to load</Typography>}
            </Box>

          </Grid>
        </Grid>
        <Dialog
          open={openFilter}
          TransitionComponent={Transition}
          fullScreen
          onClose={handleCloseFilterModel}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              handleCloseFilterModel();
            },
          }}
        >
          <AppBar sx={{ position: 'relative' }} elevation={0}>
            <Toolbar>
              <LocalLibraryIcon color="success" />
              <Typography sx={{ ml: 2, flex: 1, color: '#fff' }} variant="h6" component="div">
                Filter Books
              </Typography>
              <Button autoFocus color="inherit" onClick={handleCloseFilterModel} sx={{ textTransform: 'capitalize', fontWeight: 'normal' }}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent className="filter-box">
            <Box sx={{ width: { md: '50%' } }}>
              <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                <Grid item xs={4}>
                  Author :
                </Grid>
                <Grid item xs={8}>
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
                <Grid item xs={4}>
                  Book Category :
                </Grid>
                <Grid item xs={8}>
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
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button onClick={handleCloseFilterModel} variant="outlined" sx={{ textTransform: 'capitalize', width: 120 }}>Cancel</Button>
                  <Button onClick={handleSearch} type="submit" variant="contained" color="secondary" sx={{ textTransform: 'capitalize', ml: 1, width: 120 }}>Filter</Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>

          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}