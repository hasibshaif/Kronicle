/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document, Model, model, models, Schema } from "mongoose";
import { WeekdayName, FromTo, BookingTimes } from "@/lib/types";

const FromToSchema = new Schema({
    from: String,
    to: String,
    active: Boolean,
})

const BookingSchema = new Schema<Record<WeekdayName, FromTo>>({
    Monday: FromToSchema,
    Tuesday: FromToSchema,
    Wednesday: FromToSchema,
    Thursday: FromToSchema,
    Friday: FromToSchema,
    Saturday: FromToSchema,
    Sunday: FromToSchema,
})

const EventTypeSchema = new Schema<IEventType>({
    email: String,
    uri: {type: String},
    title: String,
    description: String,
    length: Number,
    bookingTimes: BookingSchema,
}, {
    timestamps: true,
});

export interface IEventType extends Document {
    email: string;
    uri: string;
    title: string;
    description: string;
    length: number;
    bookingTimes: BookingTimes;
    createdAt: Date;
    updatedAt: Date;
}

export const EventTypeModel = models?.EventType as Model<IEventType> || model<IEventType>('EventType', EventTypeSchema);