// Libraries
import { Request, Response, NextFunction } from "express";

// Middleware
import asyncHandler from "../middleware/async";

//  Business Logic
export const getAllContacts = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const contacts = [
        {
            name: "Rob",
            luckyNumber: 45
        },
        {
            name: "Henry",
            luckyNumber: 43
        }
    ];

    res.status(200).json(contacts);
});
