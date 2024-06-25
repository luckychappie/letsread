import { Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Skeleton } from '@mui/material'
import React from 'react'

interface Props {
    count: number
}

export default function Loading(props: Props) {

    const renderLoading = () => {
        const loadingItems = [];
        for (let i = 0; i < props.count; i++) {
            loadingItems.push(
                <ListItem key={i} button sx={{ bgcolor: '#5457540a', mt: 0.5 }} className="book-list-item">
                    <ListItemAvatar>
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText sx={{ px: 2 }}>

                        <Skeleton animation="wave" height={10} width="40%" />

                        <Skeleton animation="wave" height={10} width="60%" />
                        <Skeleton
                            animation="wave"
                            height={10}
                            width="80%"
                        />

                    </ListItemText>
                </ListItem>
            );
        }
        return loadingItems;
    };

    return (
        <div>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                { renderLoading() }
            </List>
        </div>
    )
}
