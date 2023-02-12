// Libraries
import { Schema, model } from "mongoose";

interface Contact {
    name: string;
    luckyNumber: number;
}


const contactSchema = new Schema<Contact>({
    name: {
        type: String,
        required: true,
    },
    luckyNumber: {
        type: Number,
        required: true,
    },
});

export = model<Contact>("Contact", contactSchema, "Contacts");