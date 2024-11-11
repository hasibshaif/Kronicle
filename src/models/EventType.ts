/* eslint-disable @typescript-eslint/no-unused-vars */
import { model, models, Schema } from "mongoose";
import { WeekdayName, FromTo, BookingTimes } from "@/lib/types";

const FromToSchema = new Schema({
    from: String,
    to: String,
})

const BookingSchema = new Schema<Record<WeekdayName, FromTo>>({
    monday: FromToSchema,
    tuesday: FromToSchema,
    wednesday: FromToSchema,
    thursday: FromToSchema,
    friday: FromToSchema,
    saturday: FromToSchema,
    sunday: FromToSchema,
})

const EventTypeSchema = new Schema<EventType>({
    email: String,
    title: String,
    description: String,
    length: Number,
    bookingTimes: BookingSchema,
}, {
    timestamps: true,
});

type EventType = {
    email: string;
    title: string;
    description: string;
    length: number;
    bookingTimes: BookingTimes;
}

export const EventTypeModel = models?.EventType || model<EventType>('EventType', EventTypeSchema);