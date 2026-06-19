"use client"

import React, { useState, useMemo, useEffect } from "react";
import { Container, Box, CssBaseline, PaletteMode, Skeleton, Stack, Drawer } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "../globals.css";
import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { MainWrapper, PageWrapper } from "@/utils/theme";
import { baseLightTheme } from "@/utils/theme/DefaultColors";
import { darkTheme } from "@/utils/theme/DarkColors";
import { getCookieUser } from "@/utils/cookie.util";

const SIDEBAR_ITEMS = [
  "DashBoard",
  "Staff",
  "HR",
  "Staff Settings",
  "Students",
  "Countries",
  "Universities",
  "Packages",
  "Invoices",
  "Payments",
  "Reports",
  "Account",
  "Admin",
  "Commission",
];

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const user = getCookieUser();
  const isLoggedIn = !!user;

  const [mode, setMode] = useState<PaletteMode>("light");
  const appliedTheme = useMemo(
    () => createTheme(mode === "light" ? baseLightTheme : darkTheme),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode: PaletteMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <MainWrapper className="mainwrapper">
        {mounted ? (
          <>
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              isMobileSidebarOpen={isMobileSidebarOpen}
              onSidebarClose={() => setMobileSidebarOpen(false)}
            />
          </>
        ) : (
          // Skeleton for sidebar and content
          <Box
            sx={{
              width: "270px",
              flexShrink: 0,
              borderRadius: "13px",
              display: { xs: "none", lg: "block" }
            }}
          >
            {/* Sidebar Skeleton */}
            <Drawer
              anchor="left"
              variant="permanent"
              PaperProps={{
                sx: {
                  boxShadow: "0 9px 17.5px rgb(0,0,0,0.05)",
                  width: "270px",
                  boxSizing: "border-box",
                  borderRight: 0,
                  top: 20,
                  left: 20,
                  bottom: 20,
                  borderRadius: "6px",
                  height: "calc(100% - 40px)",
                },
              }}
            >
              <Box
                sx={{
                  height: "100%",
                }}
              >
                {/* User Greeting Skeleton */}
                <Skeleton variant="rectangular" height={60} sx={{ mx: 1, mt: 1, pl: 1, borderRadius: 1, backgroundColor: "#f5f5f5" }} />
                {/* Sidebar items */}
                <Box sx={{ p: "10px" }}>
                  <Stack spacing={1}>
                    {SIDEBAR_ITEMS.map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        height={40}
                        sx={{ borderRadius: 1, backgroundColor: "#f5f5f5" }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Drawer>
          </Box>
        )}
        <PageWrapper className="page-wrapper">
          <Container sx={{ maxWidth: "1300px !important" }}>
            <Header
              toggleMobileSidebar={() => setMobileSidebarOpen(true)}
              toggleTheme={toggleTheme}
              mode={mode}
            />
            <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
              {children}
            </Box>
          </Container>
        </PageWrapper>
      </MainWrapper>
    </ThemeProvider >
  );
}
