"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { baseLightTheme } from "@/utils/theme/DefaultColors";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={baseLightTheme}>
      <CssBaseline />
      <ToastContainer />
      {children}
    </ThemeProvider>
  );
}