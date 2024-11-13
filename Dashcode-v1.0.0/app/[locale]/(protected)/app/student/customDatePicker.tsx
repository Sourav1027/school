import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';


interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const CustomDatePicker = ({
  value,
  onChange,
  label,
  error,
  icon = <CalendarIcon className="h-4 w-4 text-gray-500" />,
  disabled = false,
  className = '',
}: DatePickerProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Icon container */}
      <div className="absolute left-3 top-3 z-10">{icon}</div>

      <Popover>
        <PopoverTrigger asChild>
          <input
            type="text"
            value={value ? format(value, 'PPP') : ''}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : undefined)}
            placeholder={label}
            className={cn(
              'w-full pl-10 pr-3 py-2 text-left font-normal',
              !value && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
              'border rounded-md' // Add any default border or padding styles as needed
            )}
            disabled={disabled}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomDatePicker;
