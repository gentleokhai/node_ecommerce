import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import {
  CompanyRoute,
  EmployerRoute,
  AuthRoute,
  EmployeeRoute,
} from './routes';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', AuthRoute);
app.use('/employer', EmployerRoute);
app.use('/employee', EmployeeRoute);
app.use('/company', CompanyRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => console.log('error' + err));

app.listen(8000, () => {
  console.log('App is listening to the port 8000');
});
