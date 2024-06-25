import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontSize: 12
  },
  palette: {
    primary: {
      main: "#EFAFB9",
    },
    success: {
      main: "#7C9851",
    },
    secondary: {
      main: '#DE6F90'
    }
  },
});