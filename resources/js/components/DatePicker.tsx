import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';


interface DatePickerProps {
    selectedDate?: string;
    selectedEndDate?: string;
    onDateSelect?: (date: string) => void;
    onRangeSelect?: (startDate: string, endDate: string) => void;
    minDate?: string;
    label?: string;
    isRange?: boolean;
}

export function DatePicker({
                               selectedDate,
                               selectedEndDate,
                               onDateSelect,
                               onRangeSelect,
                               minDate,
                               label,
                               isRange = false
                           }: DatePickerProps) {
    const language = 'de';
    const [currentMonth, setCurrentMonth] = useState(() => {
        const date = selectedDate ? new Date(selectedDate) : new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });
    const [tempStartDate, setTempStartDate] = useState<string | null>(null);

    const monthNames = language === 'de'
        ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNames = language === 'de'
        ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Get the day of week (0 = Sunday, 1 = Monday, etc.)
        // Convert to Monday-based (0 = Monday, 6 = Sunday)
        let firstDayOfWeek = firstDay.getDay() - 1;
        if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Sunday becomes 6

        const days: (Date | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const days = getDaysInMonth(currentMonth);

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const isDateDisabled = (date: Date | null) => {
        if (!date) return true;
        if (minDate) {
            const min = new Date(minDate);
            min.setHours(0, 0, 0, 0);
            const dateToCheck = new Date(date);
            dateToCheck.setHours(0, 0, 0, 0);
            return dateToCheck < min;
        }
        return false;
    };

    const isDateSelected = (date: Date | null) => {
        if (!date) return false;

        if (isRange) {
            if (!selectedDate && !selectedEndDate) return false;
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);

            if (selectedDate) {
                const start = new Date(selectedDate);
                start.setHours(0, 0, 0, 0);
                if (checkDate.getTime() === start.getTime()) return true;
            }

            if (selectedEndDate) {
                const end = new Date(selectedEndDate);
                end.setHours(0, 0, 0, 0);
                if (checkDate.getTime() === end.getTime()) return true;
            }

            return false;
        } else {
            if (!selectedDate) return false;
            const selected = new Date(selectedDate);
            return (
                date.getDate() === selected.getDate() &&
                date.getMonth() === selected.getMonth() &&
                date.getFullYear() === selected.getFullYear()
            );
        }
    };

    const isDateInRange = (date: Date | null) => {
        if (!date || !isRange || !selectedDate || !selectedEndDate) return false;

        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        const start = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(selectedEndDate);
        end.setHours(0, 0, 0, 0);

        return checkDate > start && checkDate < end;
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const handleDateClick = (date: Date | null) => {
        if (!date || isDateDisabled(date)) return;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        if (isRange && onRangeSelect) {
            // Range selection logic
            if (!selectedDate || (selectedDate && selectedEndDate)) {
                // Start new selection
                onRangeSelect(dateString, '');
                setTempStartDate(dateString);
            } else {
                // Complete the range
                const start = new Date(selectedDate);
                const end = new Date(dateString);

                if (end < start) {
                    // If end date is before start date, swap them
                    onRangeSelect(dateString, selectedDate);
                } else {
                    onRangeSelect(selectedDate, dateString);
                }
                setTempStartDate(null);
            }
        } else if (onDateSelect) {
            // Single date selection
            onDateSelect(dateString);
        }
    };

    const canGoPrevious = () => {
        if (!minDate) return true;
        const min = new Date(minDate);
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        return prevMonth >= new Date(min.getFullYear(), min.getMonth(), 1);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 600 }}>
                    {label}
                </label>
            )}

            <div className="bg-white rounded-lg border border-gray-200">
                {/* Month/Year Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <button
                        onClick={goToPreviousMonth}
                        disabled={!canGoPrevious()}
                        className={`p-1 rounded-lg transition-colors ${
                            canGoPrevious()
                                ? 'hover:bg-gray-100 text-gray-700'
                                : 'text-gray-300 cursor-not-allowed'
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="text-sm font-semibold text-gray-900">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </div>

                    <button
                        onClick={goToNextMonth}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-3">
                    {/* Day names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="text-xs text-gray-500 text-center font-medium py-1"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((date, index) => {
                            const disabled = isDateDisabled(date);
                            const selected = isDateSelected(date);
                            const inRange = isDateInRange(date);
                            const today = isToday(date);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(date)}
                                    disabled={disabled}
                                    className={`
                    aspect-square rounded-lg text-sm transition-all
                    ${!date ? 'invisible' : ''}
                    ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                    ${selected ? 'bg-[#5555ff] text-white hover:bg-[#4444ee]' : ''}
                    ${inRange ? 'bg-[#f5f5ff] text-[#5555ff]' : ''}
                    ${!selected && !inRange ? 'text-gray-700' : ''}
                    ${today && !selected ? 'border-2 border-[#5555ff] font-semibold' : ''}
                  `}
                                >
                                    {date?.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
