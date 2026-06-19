import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

import { DashboardCardProps } from "@/type/common.types";


const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardHeading,
  headTitle,
  headSubtitle,
  middleContent,
}: DashboardCardProps) => {

  return (
    <Card sx={{ padding: 0, height: '100%', borderRadius: "7px" }} elevation={9} variant={undefined}>
      {cardHeading ? (
        <CardContent>
          <Typography variant="h5">{headTitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headSubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{
          p: {
            xs: '10px',
            sm: '20px',
            lg: '30px',
          }
        }}>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={"center"}
              mb={3}
            >
              <Box>
                {title ? <Typography variant="h5">{title}</Typography> : ""}

                {subtitle ? (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                ) : (
                  ""
                )}
              </Box>
              {action}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}
      {middleContent}
      {footer}
    </Card>
  );
};

export default DashboardCard;
