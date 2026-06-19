import { TableRow } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0074BA",
    },
    secondary: {
      main: "#47D7BC",
    },
    error: {
      main: "#fb977d",
    },
  },
});

export const MainWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
  [theme.breakpoints.down('md')]: {
    paddingTop: "10px",
    paddingLeft: 0,
    paddingRight: 0
  },
}));

export const PageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
  [theme.breakpoints.down('md')]: {
    paddingBottom: "30px",
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#bbb',
    color: theme.palette.common.black,
    fontSize: 12,
    width: '20%',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    width: '20%',
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f4f4',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));