"use client";

import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import 'react-toastify/dist/ReactToastify.css';

import { baseLightTheme } from "@/utils/theme/DefaultColors";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={baseLightTheme}>
          <CssBaseline />
          <ToastContainer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}