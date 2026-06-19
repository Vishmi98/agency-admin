import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import AddStudentPage from '@/app/admin/add-student/page';


jest.mock('../ui/AddStudent', () => {
    const MockAddStudent = () => <div data-testid="add-student-component" />;
    MockAddStudent.displayName = 'AddStudent'; // Add display name here
    return MockAddStudent;
});

describe('AddStudentPage', () => {
    it('renders without crashing', () => {
        const theme = createTheme();
        render(
            <ThemeProvider theme={theme}>
                <AddStudentPage />
            </ThemeProvider>
        );
    });

    it('displays the correct heading', () => {
        const theme = createTheme();
        render(
            <ThemeProvider theme={theme}>
                <AddStudentPage />
            </ThemeProvider>
        );
        expect(screen.getByText('Add Student')).toBeInTheDocument();
    });

    it('renders the AddStudent component', () => {
        const theme = createTheme();
        render(
            <ThemeProvider theme={theme}>
                <AddStudentPage />
            </ThemeProvider>
        );
        expect(screen.getByTestId('add-student-component')).toBeInTheDocument();
    });
});
