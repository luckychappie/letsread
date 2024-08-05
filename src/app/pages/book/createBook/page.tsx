"use client"
import { Alert, AlertTitle, Autocomplete, Backdrop, Button, CircularProgress, Container, Grid, Snackbar, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { theme } from '../../../../../theme/Theme'
import { CloudUpload } from '@mui/icons-material';
import { Author, Category } from '@/app/types/book';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useContextProvider } from '@/app/context/ContextProvider';

export interface CategoryApiResponse {
    categories: Category[]
}

export interface AuthorApiResponse {
    authors: Author[]
}

interface ValidationErrors {
    title?: string
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CreateBook() {
    const {setShowSnackbar, setSnackbarMessage} = useContextProvider()
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [authors, setAuthors] = useState<Author[]>([])
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedCoverPhoto, setSelectedCoverPhoto] = useState<any>(null)
    const [coverPhotoName, setCoverPhotoName] = useState<any>(null)
    const [selectedFile, setSelectedFile] = useState<any>(null)
    const [selectedFileName, setSelectedFileName] = useState<any>(null)
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [categoryError, setCategoryError] = useState<string>('')
    const [authorError, setAuthorError] = useState<string>('')
    const [coverPhotoError, setCoverPhotoError] = useState<string>('')
    const [fileError, setFileError] = useState<string>('')
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const [book, setBook] = useState({
        title: '',
        authors_id: '',
        categories_id: '',
        description: '',
        coverPhoto: ''
    })

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
    });

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const validate = async (): Promise<ValidationErrors> => {

        try {
            await validationSchema.validate(book, { abortEarly: false });
            return {};
        } catch (err) {
            const validationErrors: ValidationErrors = {};
            if (err instanceof Yup.ValidationError) {
                err.inner.forEach((error: Yup.ValidationError) => {
                    if (error.path) {
                        validationErrors[error.path as keyof FormValues] = error.message;
                    }
                });
            }
            return validationErrors;
        }
    };


    const handleFileUpload = (e: any) => {
        e.preventDefault();
        const file = e.target.files[0]
        setSelectedFile(file)
        if (file) {
            setSelectedFileName(file.name)
        }
        setFileError('')
    }

    const handleCoverPhotoUpload = (e: any) => {
        e.preventDefault();
        const file = e.target.files[0]
        setSelectedCoverPhoto(file)
        if (file) {
            setCoverPhotoName(file.name)
        }
        setCoverPhotoError('')
    }

    const getCategories = async () => {
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
    }

    const getAuthors = async () => {
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
    }

    const handleInput = (e: any) => {
        e.preventDefault();
        setBook({ ...book, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setCategoryError(selectedCategory?.id ? '' : 'Please choose book category')
        setAuthorError(selectedAuthor?.id ? '' : 'Please choose book author')
        setFileError(selectedFile ? '' : 'Please choose book pdf file')
        setCoverPhotoError(selectedCoverPhoto ? '' : 'Please choose book cover photo')
        const validationErrors = await validate();
        if (Object.keys(validationErrors).length === 0 && selectedCategory?.id && selectedAuthor?.id && selectedFile && selectedCoverPhoto) {

            const form = new FormData();
            form.append('title', book.title);
            form.append('description', book.title);
            form.append('authors_id', selectedAuthor?.id ? selectedAuthor?.id.toString() : '');
            form.append('categories_id', selectedCategory ? selectedCategory.id.toString() : '');
            form.append('coverPhoto', selectedCoverPhoto);
            form.append('file', selectedFile);


            try {
                const res = await fetch(`/api/books`, {
                    method: "POST",
                    body: form
                })
                if (!res.ok) {
                    throw new Error('Failed to update')
                }
                setLoading(false)
                setSnackbarMessage('Your book was submitted successfully')
                setShowSnackbar(true)
               
                router.refresh()
                router.push("/")
                
            } catch {
                console.log('error')
            }
        } else {
            // Form is invalid, show errors
            setErrors(validationErrors);
        }

        setLoading(false)

    }

    useEffect(() => {
        getCategories()
        getAuthors()

    }, [])

    return (
        <div>
            <div>
                <title>Create Book</title>
                <meta name="description" content="Create a new book to share to other people." />
                <meta name="keywords" content="Myanmar books, myanmar story, myanmar famous book, myanmar authors" />
            </div>

            <Alert icon={<AutoStoriesIcon fontSize="inherit" />} severity="success" sx={{m:1}}>
                <AlertTitle>Sharing Is Caring</AlertTitle>
                Please share your new books to others to get more knowledge and to be relax.
            </Alert>

            <Container sx={{ px: 1, pb: 2 }}>
                <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 500, fontSize: 17, mb: 1, mt: 2 }}>
                    Add New Book
                </Typography>

                {/* <svg width="300" height="100">
                    <text x="10" y="15" fill="black">မြန်မာစာအုပ်</text>
                </svg> */}

                <form onSubmit={handleSubmit} >
                    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                        <Grid item xs={4}>
                            Book Name :
                        </Grid>
                        <Grid item xs={8}>
                            <TextField name='title'
                                value={book.title}
                                onChange={handleInput}
                                error={!!errors.title}
                                helperText={errors.title}
                                fullWidth size='small' id="outlined-basic" variant="outlined" />
                        </Grid>
                    </Grid>
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
                                renderInput={(params) => <TextField name='authors_id' {...params} error={!!authorError} helperText={authorError} label="Select Author" variant="outlined" />}
                                value={selectedAuthor}
                                onChange={(event, newValue) => { setSelectedAuthor(newValue); setAuthorError('') }}
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
                                renderInput={(params) => <TextField {...params} error={!!categoryError} helperText={categoryError} label="Select Category" variant="outlined" />}
                                value={selectedCategory}
                                onChange={(event, newValue) => { setSelectedCategory(newValue); setCategoryError('') }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                        <Grid item xs={4}>
                            Book Description :
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                multiline
                                maxRows={4}
                                name='description'
                                value={book.description}
                                onChange={handleInput}
                                fullWidth size='small'
                                id="outlined-basic"
                                variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                        <Grid item xs={4}>
                            Cover Photo :
                        </Grid>
                        <Grid item xs={8}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="text"
                                color="success"
                                tabIndex={-1}
                                startIcon={<CloudUpload />}
                            >
                                Upload file
                                <VisuallyHiddenInput onChange={handleCoverPhotoUpload} accept="image/*" name='coverPhoto' type="file" />
                            </Button>
                            {
                                coverPhotoName &&
                                <Typography sx={{ fontSize: 11, color: '#959394', ml: 1 }}>{coverPhotoName}</Typography>
                            }

                            {coverPhotoError && (
                                <Typography color="error" variant="body2">
                                    {coverPhotoError}
                                </Typography>
                            )}

                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                        <Grid item xs={4}>
                            Upload PDF file :
                        </Grid>
                        <Grid item xs={8}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="text"
                                color="success"
                                tabIndex={-1}
                                startIcon={<CloudUpload />}
                            >
                                Upload file
                                <VisuallyHiddenInput onChange={handleFileUpload} accept="image/*" name='file' type="file" />
                            </Button>
                            {
                                selectedFileName &&
                                <Typography sx={{ fontSize: 11, color: '#959394', ml: 1 }}>{selectedFileName}</Typography>
                            }
                            {fileError && (
                                <Typography color="error" variant="body2">
                                    {fileError}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ textAlign: 'center', mt: 2 }}>
                        <Grid item xs={12}>
                            <Button type='submit' color='success' variant='contained' sx={{ textTransform: 'capitalize' }} >Submit Books</Button>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={loading}
                            >
                                <CircularProgress color="inherit" />
                                <Typography sx={{ ml: 2, fontSize: 15 }}> Saving please wait... </Typography>
                            </Backdrop>
                        </Grid>
                    </Grid>

                </form>
                <Snackbar
                    open={open}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Your book was submitted successfully."
                />
            </Container>
        </div>
    )
}
