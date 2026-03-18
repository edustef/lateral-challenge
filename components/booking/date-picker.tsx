'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
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
  disabledDates?: { from: string; to: string }[];
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
  disabledDates = [],
}: DatePickerProps) {
  const disabledMatchers = disabledDates.map((range) => ({
    from: new Date(range.from + 'T00:00:00'),
    to: new Date(range.to + 'T00:00:00'),
  }));
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
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-small border border-border bg-bg-card px-4 h-12 text-sm text-text-primary"
          />
        }
      >
        <CalendarDays size={16} className="shrink-0 text-text-muted" />
        {date?.from ? (
          date.to ? (
            <span>
              {format(date.from, 'MMM d')} – {format(date.to, 'MMM d')}
            </span>
          ) : (
            <span>{format(date.from, 'MMM d')} – …</span>
          )
        ) : (
          <span className="text-text-muted">Select dates</span>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-(--anchor-width) overflow-visible p-0"
        align="start"
      >
        <Calendar
          mode="range"
          defaultMonth={date?.from ?? getTomorrow()}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={1}
          disabled={[{ before: getTomorrow() }, ...disabledMatchers]}
          className="w-full p-3"
        />
      </PopoverContent>
    </Popover>
  );
}
