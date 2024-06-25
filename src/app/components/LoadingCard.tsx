import { Card, Skeleton } from '@mui/material'
import React from 'react'
import Loading from './Loading'

export default function LoadingCard() {
    return (
        <div>
            <Loading count={1} />
            <Card elevation={0} sx={{ mt: 2 }}>
                <Skeleton sx={{ height: 80 }} animation="wave" variant="rectangular" />
            </Card>
            <Card sx={{ mt: 3 }} elevation={0}>
                <Skeleton
                    animation="wave"
                    height={10}
                    width="60%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton
                    animation="wave"
                    height={10}
                    width="80%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
                <Skeleton
                    animation="wave"
                    height={10}
                    width="60%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton
                    animation="wave"
                    height={10}
                    width="80%"
                    style={{ marginBottom: 6 }}
                /> <Skeleton
                    animation="wave"
                    height={10}
                    width="60%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton
                    animation="wave"
                    height={10}
                    width="80%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton sx={{ height: 80 }} animation="wave" variant="rectangular" />
                <Skeleton
                    animation="wave"
                    height={10}
                    width="80%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
                <Skeleton
                    animation="wave"
                    height={10}
                    width="60%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton
                    animation="wave"
                    height={10}
                    width="80%"
                    style={{ marginBottom: 6 }}
                /> <Skeleton
                    animation="wave"
                    height={10}
                    width="60%"
                    style={{ marginBottom: 6 }}
                />
            </Card>
        </div>
    )
}
