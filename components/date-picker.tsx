'use client';

interface DatePickerProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
}

function toDateString(date: Date | undefined): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateString(d);
}

export function DatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DatePickerProps) {
  const minDate = getTomorrow();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1 block text-sm text-text-secondary">
          Check-in
        </label>
        <input
          type="date"
          value={toDateString(checkIn)}
          min={minDate}
          onChange={(e) =>
            onCheckInChange(e.target.value ? new Date(e.target.value + 'T12:00:00') : undefined)
          }
          className="w-full rounded-small border border-border bg-bg-card px-3 py-2 text-sm text-text-body focus:ring-2 focus:ring-accent/30 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-text-secondary">
          Check-out
        </label>
        <input
          type="date"
          value={toDateString(checkOut)}
          min={checkIn ? toDateString(new Date(checkIn.getTime() + 86400000)) : minDate}
          onChange={(e) =>
            onCheckOutChange(e.target.value ? new Date(e.target.value + 'T12:00:00') : undefined)
          }
          className="w-full rounded-small border border-border bg-bg-card px-3 py-2 text-sm text-text-body focus:ring-2 focus:ring-accent/30 focus:outline-none"
        />
      </div>
    </div>
  );
}
