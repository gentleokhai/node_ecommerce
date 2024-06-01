"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const express_handlebars_1 = require("express-handlebars");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
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
    viewEngine: (0, express_handlebars_1.create)({
        partialsDir: path_1.default.resolve(__dirname, '../../src/views/'),
        defaultLayout: false,
    }),
    viewPath: path_1.default.resolve(__dirname, '../../src/views/'),
};
// path.resolve(__dirname, '../../src/uploads'))
transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
/**
 * Function to send an email.
 * @param {Object} options - Email options, including 'to', 'from', 'subject', 'template', and any additional variables.
 */
function sendEmail(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { to, from, subject, template, firstName, verificationLink } = options, rest = __rest(options, ["to", "from", "subject", "template", "firstName", "verificationLink"]);
        const emailTemplatePath = path_1.default.resolve(__dirname, `../../src/views/${template}.handlebars`);
        const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf-8');
        const compiledTemplate = handlebars_1.default.compile(emailTemplate);
        const context = { firstName, verificationLink };
        const html = compiledTemplate(context);
        transporter.sendMail(Object.assign({ to,
            from,
            subject,
            html }, rest), (err, info) => {
            if (err) {
                console.log(err, 'Error sending mail');
                return;
            }
            console.log(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        });
    });
}
exports.default = sendEmail;
