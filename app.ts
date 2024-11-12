import express from "express";
import cors from "cors";
import path from "path";
import router from "./routers/router";
import './db';

export const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/image', express.static(path.join(__dirname, '../OTT_WEB-client/public/image')));

app.use(router);

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. http://localhost:${port}`);
});