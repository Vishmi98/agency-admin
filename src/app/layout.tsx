"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import 'react-toastify/dist/ReactToastify.css';

import { baseLightTheme } from "@/utils/theme/DefaultColors";
import { getCookieUser } from '@/utils/cookie.util';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();
  const user = getCookieUser();

  // Determine if a user is validly logged in
  const isLoggedIn = !!user;

  const checkCookieAndRedirect = () => {
    // Only redirect to root if they aren't logged in AND aren't already on the root page
    if (!isLoggedIn && pathName !== '/') {
      router.push('/');
    }
  };

  useEffect(() => {
    checkCookieAndRedirect();
  }, [pathName, isLoggedIn]);

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