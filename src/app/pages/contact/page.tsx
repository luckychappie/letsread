"use client"
import { Alert, AlertTitle, Backdrop, Button, CircularProgress, Container, Grid, IconButton, Snackbar, SnackbarContent, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { theme } from '../../../../theme/Theme'
import SendIcon from '@mui/icons-material/Send';
import { Author, Category } from '@/app/types/book';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Close } from '@mui/icons-material';

export interface CategoryApiResponse {
    categories: Category[]
}

export interface AuthorApiResponse {
    authors: Author[]
}

interface ValidationErrors {
    name?: string
    message?: string
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


const initialContactState = {
    message: '',
    email: '',
    name: '',
  };

export default function Contact() {
    const router = useRouter()
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [open, setOpen] = React.useState<boolean>(false);
    const [openErrorAlert, setOpenErrorAlert] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const [contact, setContact] = useState(initialContactState)

    const validationSchema = Yup.object().shape({
        message: Yup.string()
            .required('Message is required'),
        name: Yup.string()
            .required('Name is required')
    });

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpenErrorAlert(false)
    };

    const validate = async (): Promise<ValidationErrors> => {

        try {
            await validationSchema.validate(contact, { abortEarly: false });
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


    const handleInput = (e: any) => {
        e.preventDefault();
        setContact({ ...contact, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
      
        const validationErrors = await validate();
        if (Object.keys(validationErrors).length === 0 ) {

            const form = new FormData();
            form.append('name', contact.name);
            form.append('message', contact.message);
            form.append('email', contact.email);

            try {
                const res = await fetch(`/api/contact`, {
                    method: "POST",
                    body: form
                })
                if (!res.ok) {
                    throw new Error('Failed to send message')
                }
                setLoading(false)
                await setOpen(true)
                setInterval(() => {
                    router.refresh()
                }, 3000)

                setContact(initialContactState)

            } catch(err: any) {
                setOpenErrorAlert(true)
                setErrors(validationErrors);
            }
        } else {
            // Form is invalid, show errors
            setErrors(validationErrors);
        }

        setLoading(false)

    }

    return (
        <div>
            <div>
                <title>Contact Us</title>
                <meta name="description" content="Contact us to know more about and can give suggestions to improve my book application" />
                <meta name="keywords" content="Myanmar books, myanmar story, myanmar famous book, myanmar authors" />
            </div>

            <Alert icon={<AutoStoriesIcon fontSize="inherit" />} severity="success" sx={{m:1}}>
                <AlertTitle>Plese feel free to ask</AlertTitle>
                You can give any suggestion or ask if you want to know more about by sending messages to us.
            </Alert>

            <Container sx={{ px: 1, pb: 2 }}>
                <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 500, fontSize: 17, mb: 1, mt: 2 }}>
                    Contact Us
                </Typography>

                <form onSubmit={handleSubmit} >
                    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                        <Grid item xs={4}>
                            Your Name :
                        </Grid>
                        <Grid item xs={8}>
                            <TextField name='name'
                                value={contact.name}
                                onChange={handleInput}
                                error={!!errors.name}
                                helperText={errors.name}
                                fullWidth size='small'  variant="outlined" />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                        <Grid item xs={4}>
                            Email :
                        </Grid>
                        <Grid item xs={8}>
                            <TextField name='email'
                                value={contact.email}
                                onChange={handleInput}
                                fullWidth size='small' id="outlined-basic" variant="outlined" />
                        </Grid>
                    </Grid>
                 
                    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                        <Grid item xs={4}>
                            Message :
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                multiline
                                maxRows={4}
                                name='message'
                                value={contact.message}
                                onChange={handleInput}
                                error={!!errors.message}
                                helperText={errors.message}
                                fullWidth 
                                id="outlined-basic"
                                variant="outlined" />
                        </Grid>
                    </Grid>
                    
                    <Grid container spacing={2} sx={{ textAlign: 'center', mt: 2 }}>
                        <Grid item xs={12}>
                            <Button type='submit' color='success' variant='contained' endIcon={<SendIcon/>} sx={{ textTransform: 'capitalize' }} > Send Message </Button>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={loading}
                            >
                                <CircularProgress color="inherit" />
                                <Typography sx={{ ml: 2, fontSize: 15 }}> Sending please wait... </Typography>
                            </Backdrop>
                        </Grid>
                    </Grid>

                </form>
                <Snackbar
                    open={open}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Your message was submitted successfully."
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    }
                />
                <Snackbar
                    open={openErrorAlert }
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <SnackbarContent 
                        sx={{bgcolor:'#de2424'}} 
                        message={<span>Message cannot be sent. Please try again later.</span>}
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={handleClose}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        }
                    />
                </Snackbar>
            </Container>
        </div>
    )
}
