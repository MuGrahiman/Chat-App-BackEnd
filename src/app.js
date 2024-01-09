import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {createUser} from './Controller/userAth.js'

dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
  });
app.post("/sign-up", createUser);
app.post("/sign-in");

export default app