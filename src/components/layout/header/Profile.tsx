"use client"

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
} from "@mui/material";

import { getCookieUser, handleCleanCookie } from "@/utils/cookie.util";


const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const user = getCookieUser();

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  let avatarPath = ''
  if (user) {
    if (user?.updateAvatarPath) {
      avatarPath = user.updateAvatarPath;
    } else if (user?.avatarPath !== "") {
      avatarPath = user.avatarPath as string;
    }
  }

  const handleLogOut = () => {
    handleCleanCookie()
    window.location.href = '/';
  }

  return (
    <Box sx={{ margin: 0, padding: 0}}>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={avatarPath || "/images/profile/user-1.jpg"}
          alt="image"
          sx={{
            width: 25,
            height: 25,
            padding: 0
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleLogOut}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
