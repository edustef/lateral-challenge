'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
}

function getTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function DatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    checkIn ? { from: checkIn, to: checkOut } : undefined
  );

  function handleSelect(selected: DateRange | undefined) {
    setDate(selected);
    if (selected?.from && selected?.to) {
      onCheckInChange(selected.from);
      onCheckOutChange(selected.to);
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!date?.from}
            className="w-full justify-start px-2.5 font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarDays />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, 'MMM d')} – {format(date.to, 'MMM d')}
            </>
          ) : (
            <>{format(date.from, 'MMM d')} – …</>
          )
        ) : (
          <span>Select dates</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-visible p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from ?? getTomorrow()}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={1}
          disabled={{ before: getTomorrow() }}
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  );
}
