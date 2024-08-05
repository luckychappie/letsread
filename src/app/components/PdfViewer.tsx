// src/components/PdfViewer.js
import { Box, Button, CircularProgress, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { theme } from '../../../theme/Theme';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

interface Props {
  fileUrl: string,
  bookId: number
}

interface SavePage {
  book_id: number,
  page_no: number
}



const PdfViewer = (props: Props) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loadingPages, setLoadingPages] = useState<any>([]);
  const [savedPage, setSavedPage] = useState<number>(0);
  const listPage = []

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setLoadingPages(new Array(numPages).fill(true));
  }

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  }

  const getSavedPage = (): number | null => {
    let savedPages = localStorage.getItem('saved_page');

    if (!savedPages) return null;
    let savedPagesArray: SavePage[] = JSON.parse(savedPages);
    const savedPage = savedPagesArray.find(page => page.book_id === props.bookId);

    return savedPage ? savedPage.page_no : null;
  };


  const markPage = () => {
    let savedPages = localStorage.getItem('saved_page');

    let savedPagesArray: SavePage[] = savedPages ? JSON.parse(savedPages) : [];

    const updatedPagesArray = savedPagesArray.filter(page => page.book_id !== props.bookId);
    updatedPagesArray.push({ book_id: props.bookId, page_no: pageNumber });

    localStorage.setItem('saved_page', JSON.stringify(updatedPagesArray));

    setSavedPage(pageNumber);
  }

  useEffect(() => {
    const savedPage = getSavedPage();
    if (savedPage) {
      setSavedPage(savedPage)
      setPageNumber(savedPage);
    }
  }, []);


  for (let i = 0; i < numPages; i++) {
    listPage.push(<MenuItem key={i} sx={{ height: 20 }} value={i + 1}>{i + 1}</MenuItem>);
  }

  const onPageLoadSuccess = (pageIndex: any) => {
    setLoadingPages((prevLoadingPages: any) => {
      const newLoadingPages = [...prevLoadingPages];
      newLoadingPages[pageIndex] = false;
      return newLoadingPages;
    });
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <IconButton color='success' onClick={goToPrevPage} disabled={pageNumber <= 1} aria-label="prev"><SkipPreviousIcon /></IconButton>
          <Typography color="#adadadde"> Page <b className='text-pink'> {pageNumber} </b>of {numPages} </Typography>
          <IconButton color='success' onClick={goToNextPage} disabled={pageNumber >= numPages} aria-label="next"><SkipNextIcon /></IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 11, color: '#9f9f9f' }}>Page: </Typography>
          <FormControl sx={{ m: 1, minWidth: 50, height: 30 }} size="small">
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={pageNumber}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ height: 25, mt: 0.5 }}
              onChange={(e) => { setPageNumber(e.target.value) }}
            >
              {listPage}
            </Select>
          </FormControl>
          <IconButton aria-label='Save' color='secondary' onClick={markPage}>
            {
              savedPage !== pageNumber ? (
                <BookmarkBorderOutlinedIcon />
              ) : (
                <BookmarkOutlinedIcon />
              )
            }

          </IconButton>
        </Box>
      </Box>
      <Box sx={{
        width: '100%',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto',
        padding: '12px 0px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#7C9851',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        <Document className='w-100' file={props.fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} renderTextLayer={false} />
          {/* {Array.from(
          new Array(numPages),
          (el, index) => (
            <Box key={`page_${index + 1}`} position="relative">
               {loadingPages[index] && (
                <Skeleton variant="rectangular" height={150} />
              )}
              <Page key={`page_${index + 1}`} 
                 pageNumber={index + 1} renderTextLayer={false}  onLoadSuccess={() => onPageLoadSuccess(index)} />
              <Divider sx={{color: 'green', mt: 2, mb: 2}} > <Typography sx={{textAlign: 'right', fontSize: 10, color: theme.palette.success.main, mb: 1}} > Page { index + 1 } </Typography> </Divider>
            </Box>
          )
        )} */}
        </Document>
      </Box>

    </div>
  );
};

export default PdfViewer;
