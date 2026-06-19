"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Collapse } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

import { NavItemProps } from "@/type/common.types";


export default function NavItem({
  item,
  level,
  pathDirect,
  hideMenu,
  onClick,
}: NavItemProps) {

  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;
  const itemIcon = <Icon stroke={1.5} size="1.3rem" />;
  const router = useRouter();

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (item.children) {
      toggleExpand();
    } else if (item.href) {
      if (onClick) onClick(event); // pass the event along
      router.push(item.href);
    }
  };

  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <ListItemButton
        onClick={handleClick}
        selected={pathDirect === item?.href || expanded}
        sx={{
          padding: "5px",
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            color: "#0000FF",
            "& svg": {
              color: "#0000FF",
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(0, 0, 255, 0.2)",
          },
          "&:hover": {
            backgroundColor: "rgba(0, 0, 255, 0.2)",
            color: "#0000FF",
            "& svg": {
              color: "#0000FF"
            }
          },
        }}
      >
        {itemIcon && <ListItemIcon>{itemIcon}</ListItemIcon>}
        <ListItemText sx={{ marginLeft: -3 }} primary={item.title} primaryTypographyProps={{ fontSize: "12px" }} />
        {item.children && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            {expanded ? <KeyboardArrowUp sx={{ fontSize: "16px" }} /> : <KeyboardArrowDownIcon sx={{ fontSize: "16px" }} />}
          </div>
        )}
      </ListItemButton>

      {/* Render submenus if `children` exists */}
      {item.children && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="li" disablePadding style={{ paddingLeft: 10, paddingTop: 10, backgroundColor: "#e6e6e6" }}>
            {item.children.map((subItem) => (
              <NavItem
                key={subItem.id}
                item={subItem}
                level={level + 1}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={onClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </List>
  );
}
