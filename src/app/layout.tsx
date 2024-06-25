import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../../theme/ThemeRegistery";
import Header from "./components/Header";
import { Box, Card } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Myanmar Books",
  description: "Lets take a rest with myanamr books and stories.",
  keywords: 'myanmar books, myanmar story, myanmar famous book, myanmar authors, myanmar history, myanmar poem',
  icons: '/static/small-logo.png',
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry options={{ key: 'mui-theme' }}>
          <Box >
            <Header />
            <div className="main-content">
              <Card elevation={0} className="content">
                {children}
              </Card>

            </div>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
