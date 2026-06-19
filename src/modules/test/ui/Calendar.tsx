"use client";

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { CalendarPageProps, Value } from '../test.types';


const CalendarPage: React.FC<CalendarPageProps> = ({ onDateChange }) => {
    const [value, onChange] = useState<Value>(new Date());

    const handleDateChange = (newValue: Value) => {
        onChange(newValue);
        if (newValue instanceof Date) {
            onDateChange(newValue);
        } else if (Array.isArray(newValue) && newValue.length > 0 && newValue[0] instanceof Date) {
            onDateChange(newValue[0]);
        }
    };    

    return (
        <Calendar onChange={handleDateChange} value={value} />
    );
};

export default CalendarPage;