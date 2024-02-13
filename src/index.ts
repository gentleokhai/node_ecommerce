import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import { CompanyRoute, UserRoute } from './routes';
import { AuthRoute } from './routes/AuthRoute';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
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
