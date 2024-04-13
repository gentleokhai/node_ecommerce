import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import {
  CompanyRoute,
  EmployerRoute,
  AuthRoute,
  EmployeeRoute,
  ItemRoute,
} from './routes';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const corsOptions = {
  origin: 'https://zulu-dev.vercel.app',
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
    console.log(req, 'here');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + path.extname(file.originalname));
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use('/auth', AuthRoute);
app.use('/employer', EmployerRoute);
app.use('/employee', EmployeeRoute);
app.use('/company', CompanyRoute);
app.use('/item', ItemRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => console.log('error' + err));

app.listen(8000, () => {
  console.log('App is listening to the port 8000');
});
