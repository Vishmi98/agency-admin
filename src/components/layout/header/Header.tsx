import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import { IconMenu } from "@tabler/icons-react";

import Profile from "./Profile";

import { HeaderProps } from "@/type/common.types";
import { getCookieUser, getUserRollTitle } from "@/utils/cookie.util";


const Header = ({ toggleMobileSidebar }: HeaderProps & { toggleTheme: () => void; mode: string }) => {

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderRadius: 8,
    display: "block", // default: show on xs
    [theme.breakpoints.up("lg")]: {
      display: "none", // hide on md and above
    },
  }));

  const user = getCookieUser()

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{}}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {user && <Typography sx={{ fontWeight: 'bold' }}>{`Hi ${user?.firstName} (${getUserRollTitle(user.roll)})`}</Typography>}

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
