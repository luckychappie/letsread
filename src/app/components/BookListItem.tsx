import React from 'react'
import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import SmallChip from './SmallChip';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded';
import Link from 'next/link';
import { theme } from '../../../theme/Theme';
import { red } from '@mui/material/colors';

interface Props {
    title: string
    label: string
    secondLabel: string
    noStar?: number
    trailLabel?: string
    id: number
    img: String
}

export default function BookListItem(props: Props) {
    return (
        
            <ListItem  button component={Link} href={`/pages/book/bookDetail?id=${props.id}`} secondaryAction={
                <Box sx={{ color: theme.palette.success.main, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* <Stack direction="row" sx={{ alignItems: 'center', mb: 0.7 }}> <LocalLibraryRoundedIcon sx={{ mr: 0.5 }} /> </Stack> */}
                    {
                        (props.trailLabel) && 
                        <SmallChip label={props.trailLabel} isOutlined={true} />
                    }
                    
                </Box>
            } sx={{ bgcolor: '#5457540a' }} className="book-list-item">
                <ListItemAvatar>
                    <Avatar alt={props.title} src={`/uploads/${props.img}`} variant="rounded" sx={{ width: 60, height: 60 }} />
                </ListItemAvatar>
                <ListItemText sx={{ px: 2 }}>
                    <Typography variant="subtitle2" sx={{fontSize: 14 ,display: "flex", alignItems: 'center', color: theme.palette.secondary.main }} gutterBottom>
                        {props.title}
                    </Typography>
                    <Typography variant="body2" gutterBottom>{props.label}</Typography>
                    <Typography variant="body2" gutterBottom className='text-muted'>Author: <span className='text-dark'> {props.secondLabel} </span></Typography>
                </ListItemText>
            </ListItem>
       
    )
}
