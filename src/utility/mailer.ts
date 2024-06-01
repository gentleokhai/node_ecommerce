import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import { create } from 'express-handlebars';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  service: process.env.SMTP_SERVICE,
  port: 587,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const handlebarOptions = {
  viewEngine: create({
    partialsDir: path.resolve(__dirname, '../../src/views/'),
    defaultLayout: false,
  }),
  viewPath: path.resolve(__dirname, '../../src/views/'),
};

// path.resolve(__dirname, '../../src/uploads'))

transporter.use('compile', hbs(handlebarOptions));

/**
 * Function to send an email.
 * @param {Object} options - Email options, including 'to', 'from', 'subject', 'template', and any additional variables.
 */

async function sendEmail(options: any) {
  const { to, from, subject, template, firstName, verificationLink, ...rest } =
    options;

  const emailTemplatePath = path.resolve(
    __dirname,
    `../../src/views/${template}.handlebars`
  );

  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(emailTemplate);

  const context = { firstName, verificationLink };

  const html = compiledTemplate(context);

  transporter.sendMail(
    {
      to,
      from,
      subject,
      html,
      ...rest,
    },
    (err, info) => {
      if (err) {
        console.log(err, 'Error sending mail');
        return;
      }

      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  );
}

export default sendEmail;
