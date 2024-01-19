import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose
	.connect(process.env.CONNECTION_URL, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
	})
	.then(() => console.log('Database Connected successfully'))
	.catch((err) => console.log(err));
