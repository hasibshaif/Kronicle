export type FromTo = {
    from: string;
    to: string;
    active: boolean;
}

export type WeekdayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type BookingTimes = {
    Monday?: FromTo;
    Tuesday?: FromTo;
    Wednesday?: FromTo;
    Thursday?: FromTo;
    Friday?: FromTo;
    Saturday?: FromTo;
    Sunday?: FromTo;
};