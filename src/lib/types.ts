export type FromTo = {
    from: string;
    to: string;
    active: boolean;
}

export type WeekdayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type BookingTimes = Record<WeekdayName, FromTo>;
