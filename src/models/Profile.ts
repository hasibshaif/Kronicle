import mongoose, { model, models, Schema } from "mongoose";

export interface IProfile extends mongoose.Document{
    email: string;
    username: string;
    grantId: string;
}

const ProfileSchema = new Schema<IProfile>({
    email: {type: String, required: true, unique: true},
    username: {type: String, unique: true},
    grantId: {type: String},
})

export const ProfileModel = models?.Profile || model('Profile', ProfileSchema);