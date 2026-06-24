"use client"

import React from "react";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";

import NavItem from "./NavItem";

import { getCookieUser } from "@/utils/cookie.util";
import { NZ_TEAM_MENU_ITEMS, SL_TEAM_MENU_ITEMS, SUPER_ADMIN_MENU_ITEMS } from "@/constants/data";


const SidebarItems = ({ toggleMobileSidebar }: { toggleMobileSidebar?: () => void }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const user = getCookieUser();

  let MENU_ITEMS: any[] = [];

  if (user && user.roll) {
    switch (user.roll) {
      case 1: //Super admin
        MENU_ITEMS = SUPER_ADMIN_MENU_ITEMS
        break;
      case 2: // SL team
        MENU_ITEMS = SL_TEAM_MENU_ITEMS;
        break;
      case 3: // NZ team
        MENU_ITEMS = NZ_TEAM_MENU_ITEMS
        break;
      default:
        MENU_ITEMS = [];
    }
  } else {
    MENU_ITEMS = [];
  }

  return (
    <Box sx={{ px: "5px" }}>
      <List sx={{}} className="sidebarNav" component="div">
        {MENU_ITEMS.map((item) => {
          return (
            <NavItem
              key={item.id}
              item={item}
              pathDirect={pathDirect}
              onClick={(event) => {
                // Make sure it matches the expected type
                if (toggleMobileSidebar) toggleMobileSidebar();
              }}
            />
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
