import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoute from "./Routes/userRoute.js";
import chatRoute from "./Routes/chatRoute.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});
app.use('/api', userRoute);
app.use("/api/chat", chatRoute);

export default app;
