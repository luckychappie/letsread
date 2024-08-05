import { BubbleChart, Message, Search } from '@mui/icons-material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { Box, Divider, Drawer, ImageList, ImageListItem, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react'
import { navItems } from '../constants/navItems';
import { bookAdvs } from '../constants/books';
import Link from 'next/link';
import iconMapping from '../api/contact/iconMapping';
import { theme } from '../../../theme/Theme';

interface Props {
    window?: () => Window
    mobileOpen: boolean
    sendSidebarStatus: Function
}

export default function Sidebar(props: Props) {

    const { window, mobileOpen, sendSidebarStatus } = props;

    const handleSidebar = () => {
        sendSidebarStatus(mobileOpen)
    }

    const container = window !== undefined ? () => window().document.body : undefined;
    const drawer = (
        <Box onClick={handleSidebar} >
            <Box sx={{ bgcolor: '#FFF' }}>
                <img alt='Korea Movies' src='/static/small-logo.png' className='sidebar-icon' />
            </Box>

            <Divider />
            <Box>
                <List >
                    {navItems.map((item) => 
                        {
                            const iconComponent = iconMapping[item.icon];
                            return (

                            <Link key={item.title} href={item.link} style={{color: '#000'}} >
                                <ListItem disablePadding  >
                                    <ListItemButton >
                                        <ListItemIcon sx={{ minWidth: 33 }}>
                                            {iconComponent && React.createElement(iconComponent,  { style: { fontSize: 20, color: theme.palette.secondary.main } })}
                                        </ListItemIcon>
                                        <ListItemText sx={{}} primary={item.title} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            )
                        }
                    )}
                </List>

            </Box>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <img src='/static/sharing-meaning.png' alt='Sharing is caring' width={'100%'} />
            <Typography />
            <Box borderRadius={1} sx={{ bgcolor: '#000000', px: 1, py: 0.5, m: 1 }}>
                <ImageList sx={{ width: '100%' }} cols={3} variant="woven" gap={8}>
                    {bookAdvs.map((item) => (
                        <ImageListItem key={item.title}>
                            <img
                                srcSet={`${item.img}?fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.img}?fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Box>
    );

    return (
        <nav>
            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleSidebar}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: {xs: '85%', sm: '65%', md: '23%'},
                        bgcolor: '#F8DBDF'
                    },
                    zIndex: 3000
                }}
            >
                {drawer}
            </Drawer>
        </nav>
    )
}
