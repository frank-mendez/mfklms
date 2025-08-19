'use client';
import { useState } from 'react';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Calendar() {
  const [value, setValue] = useState<Value>(new Date());
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-base-200 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Calendar</h2>
      <div className="calendar-wrapper">
        <CalendarComponent
          onChange={setValue}
          value={value}
          className="border-none w-full bg-base-100 rounded-lg shadow"
          tileClassName={({ date, view }) =>
            view === 'month'
              ? 'hover:bg-primary hover:text-primary-content rounded transition-colors duration-150 cursor-pointer'
              : undefined
          }
        />
      </div>
    </div>
  );
}
