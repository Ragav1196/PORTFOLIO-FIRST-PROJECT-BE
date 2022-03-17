// INITIALIZING THE FUNCITON TO SEND MAIL FOR PASSWORD RESET

import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import dotenv from "dotenv";

dotenv.config();

const SEND_EMAIL_KEY = process.env.SEND_EMAIL_KEY;

export const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SEND_EMAIL_KEY,
    },
  })
);
