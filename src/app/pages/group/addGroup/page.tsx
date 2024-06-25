"use client"
import { Button, Container, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { theme } from '../../../../../theme/Theme'

export default function AddGroup() {
    return (
        <Container sx={{ px: 1, py: 2 }}>
            <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 500, fontSize: 17, mb: 3, mt: 2 }}>
                Add My Group
            </Typography>
            <form>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid item xs={4}>
                        Email :
                    </Grid>
                    <Grid item xs={8}>
                        <TextField fullWidth size='small' id="outlined-basic" label="Outlined" variant="outlined" />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                    <Grid item xs={4}>
                        Password :
                    </Grid>
                    <Grid item xs={8}>
                        <TextField fullWidth size='small' id="outlined-basic" label="Outlined" variant="outlined" />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
                    <Grid item xs={4}>
                        Group Name <br /><small className='text-muted'>(From Telegram) : </small>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField fullWidth size='small' id="outlined-basic" label="Outlined" variant="outlined" />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ textAlign: 'center', mt: 2 }}>
                    <Grid item xs={12}>
                        <Button color='success' variant='contained' >Add My Group</Button>
                    </Grid>
                </Grid>

            </form>
        </Container>
    )
}
