'use client';

import * as React from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { format, formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { getYear, setMonth, setYear } from 'date-fns';
import DropDownSelect from './dropdown-select';

// East Africa Time (EAT) is UTC+3
const timeZone = 'Africa/Nairobi';

export interface FormattedDate {
	date: Date;
	formattedDate: string;
	format: string;
}

export interface DateTimePickerProps {
	date?: Date;
	setDate?: (date: Date | undefined) => void;
	onSelect?: (date: Date | undefined) => void;
	disableToday?: boolean;
	disablePastDates?: boolean;
	disableFutureDates?: boolean;
	includeTime?: boolean;
	className?: string;
	formatStr?: string;
	placeholder?: string;
	disabledDates?: (date: Date) => boolean;
	onDateChange?: (date: Date | undefined) => void;
	getFormattedDate?: (date: FormattedDate) => void;
	startYear?: number;
	endYear?: number;
}

const DateTimePicker = ({
	date,
	setDate,
	onSelect,
	disableToday = false,
	disablePastDates = false,
	disableFutureDates = false,
	includeTime = false,
	className,
	formatStr = 'yyyy-MM-dd',
	placeholder = 'Pick a date',
	disabledDates,
	onDateChange,
	getFormattedDate,
	startYear = getYear(new Date()) - 100,
	endYear = getYear(new Date()) + 100,
}: DateTimePickerProps) => {
	const [internalDate, setInternalDate] = React.useState<Date>();
	const [selectedHour, setSelectedHour] = React.useState<string>('12');
	const [selectedMinute, setSelectedMinute] = React.useState<string>('00');
	const [open, setOpen] = React.useState(false);
	const [dropdownDate, setDropdownDate] = React.useState<Date>(new Date());

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const years = Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => startYear + i
	);
	const displayDate = date ?? internalDate;

	// Generate time options
	const hours = Array.from({ length: 24 }, (_, i) =>
		i.toString().padStart(2, '0')
	);
	const minutes = Array.from({ length: 60 }, (_, i) =>
		i.toString().padStart(2, '0')
	);

	const isDateDisabled = (day: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const testDay = new Date(day);
		testDay.setHours(0, 0, 0, 0);

		const isToday = testDay.getTime() === today.getTime();
		const isPast = testDay < today;
		const isFuture = testDay > today;

		if (disabledDates && disabledDates(testDay)) return true;
		if (disableToday && isToday) return true;
		if (disablePastDates && isPast) return true;
		if (disableFutureDates && isFuture) return true;

		return false;
	};

	const handleDateSelection = (selected: Date | undefined) => {
		if (!selected) return;

		const fullDate = new Date(
			selected.getFullYear(),
			selected.getMonth(),
			selected.getDate(),
			includeTime ? Number(selectedHour) : 0,
			includeTime ? Number(selectedMinute) : 0
		);

		const zonedDate = fromZonedTime(fullDate.toISOString(), timeZone);
		const formattedDate = formatInTimeZone(
			fullDate.toISOString(),
			timeZone,
			formatStr
		);

		setInternalDate(zonedDate);
		if (setDate) setDate(zonedDate);
		if (onSelect) onSelect(zonedDate);
		if (onDateChange) onDateChange(zonedDate);
		if (getFormattedDate)
			getFormattedDate({ date: zonedDate, formattedDate, format: formatStr });

		// setOpen(false);
	};

	// Sync time if controlled `date` prop changes
	React.useEffect(() => {
		const d = date ?? internalDate;
		if (d && includeTime) {
			setSelectedHour(d.getHours().toString().padStart(2, '0'));
			setSelectedMinute(d.getMinutes().toString().padStart(2, '0'));
		}
	}, [date, internalDate, includeTime]);

	// Sync time changes into date
	React.useEffect(() => {
		if (!includeTime) return;

		const d = date ?? internalDate;
		if (!d) return;

		const updated = new Date(d);
		updated.setHours(Number(selectedHour));
		updated.setMinutes(Number(selectedMinute));

		if (setDate) setDate(updated);
		if (!date) setInternalDate(updated); // uncontrolled
	}, [selectedHour, selectedMinute]);

	const handleMonthChange = (month: string) => {
		const newDate = setMonth(dropdownDate, months.indexOf(month));
		handleDateSelection(newDate);
		setDropdownDate(newDate);
	};

	const handleYearChange = (year: string) => {
		const newDate = setYear(dropdownDate, parseInt(year));
		handleDateSelection(newDate);
		setDropdownDate(newDate);
	};

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant='outline'
						className={cn(
							'w-full justify-start text-left font-normal h-11',
							!displayDate && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{displayDate
							? format(displayDate, includeTime ? 'PPP HH:mm' : 'PPP')
							: placeholder}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<div className='flex justify-between gap-2 p-2'>
						<DropDownSelect
							options={months}
							placeholder='Month'
							className='w-[120px]'
							onValueChange={(value: string) => handleMonthChange(value)}
							isSearchable={true}
						></DropDownSelect>

						<DropDownSelect
							options={years}
							placeholder='Year'
							className='w-[120px]'
							onValueChange={(value: string) => handleYearChange(value)}
							isSearchable={true}
						></DropDownSelect>
					</div>
					<Calendar
						mode='single'
						selected={displayDate}
						onSelect={handleDateSelection}
						disabled={isDateDisabled}
						month={dropdownDate}
						onMonthChange={setDropdownDate}
						initialFocus
					/>
					{includeTime && (
						<div className='border-t p-3 flex items-center gap-2'>
							<Clock className='mr-2 h-4 w-4 text-muted-foreground' />
							<DropDownSelect
								options={hours}
								placeholder='Hrs'
								className='w-[70px]'
								isSearchable={true}
								defaultValue={selectedHour}
								onValueChange={setSelectedHour}
							></DropDownSelect>
							:
							<DropDownSelect
								options={minutes}
								placeholder='Min'
								className='w-[70px]'
								isSearchable={true}
								defaultValue={selectedMinute}
								onValueChange={setSelectedMinute}
							></DropDownSelect>
						</div>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default DateTimePicker;
