"use client"

import React from "react";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";

import NavItem from "./NavItem";

import { SALES_EXECUTIVE_MENU_ITEMS, HR_ACCOUNTANT_MENU_ITEMS, TEMP_CEO_MENU_ITEMS, CONSULTANT_MENU_ITEMS, JUNIOR_CONSULTANT_MENU_ITEMS, OPERATION_MENU_ITEMS } from "@/constants/data";
import { getCookieUser } from "@/utils/cookie.util";


const SidebarItems = ({ toggleMobileSidebar }: { toggleMobileSidebar?: () => void }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const user = getCookieUser();

  let MENU_ITEMS: any[] = [];

  if (user && user.roll) {
    switch (user.roll) {
      case 1://Admin
      case 5://CEO
        MENU_ITEMS = TEMP_CEO_MENU_ITEMS.map((item) => {
          // Hide HR tab unless user.id is 102 or 105
          if (item.title === "HR" && ![102, 105].includes(user.id)) {
            return null;
          }
          return item;
        }).filter(Boolean); // remove null items
        break;
      case 8: // Operation Manager
        MENU_ITEMS = OPERATION_MENU_ITEMS;
        break;
      case 2: // Consultant
        MENU_ITEMS = CONSULTANT_MENU_ITEMS
          .map((item) => {
            // Show "Success Stories" only for user id 107
            if (item.title === "Success Stories" && user.id !== 107) {
              return null;
            }
            return item;
          })
          .filter(Boolean);
        break;
      case 10://Junior Consultant
        MENU_ITEMS = JUNIOR_CONSULTANT_MENU_ITEMS;
        break;
      case 6://Marketing Manager
      case 4://Accounts
      case 9://Coordinator
      case 7://Branch Manager
        MENU_ITEMS = SALES_EXECUTIVE_MENU_ITEMS;
        break;
      case 3: // HR
        MENU_ITEMS = HR_ACCOUNTANT_MENU_ITEMS.map((item) => {
          if (item.title === "HR" && user.id !== 124) {
            return null;
          }
          return item;
        }).filter(Boolean);
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
