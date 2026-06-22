"use client"

import { useMediaQuery, Box, Drawer, Typography } from "@mui/material";

import SidebarItems from "./SidebarItems";
import Profile from "../header/Profile";

import { SidebarItemType } from "@/type/common.types";
import { getCookieUser } from "@/utils/cookie.util";


const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: SidebarItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const sidebarWidth = "270px";
  const user = getCookieUser()

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          borderRadius: "13px",
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              boxShadow: "0 9px 17.5px rgb(0,0,0,0.05)",
              width: sidebarWidth,
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
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box mx={1} mt={1} pl={1} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 1, backgroundColor: "#f5f5f5" }}>
              {user && <Typography sx={{ fontWeight: 'bold' }}>{`Hi ${user?.firstName}`}</Typography>}
              <Profile />
            </Box>
            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={(event) => onSidebarClose?.()}
      variant="temporary"
      transitionDuration={300} // smooth open/close in ms
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
          transition: "all 0.3s ease", // optional extra smoothness
        },
      }}
      ModalProps={{
        keepMounted: true, // improves performance on mobile
      }}
    >
      <SidebarItems toggleMobileSidebar={() => onSidebarClose?.()} />
    </Drawer>
  );
};

export default Sidebar;
