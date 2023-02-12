import express from "express";
const router = express.Router();

//  * Controllers
import { getAllContacts } from "../controllers/first";


// * Get All Contacts
router.route("/all").get(getAllContacts);

export = router;
