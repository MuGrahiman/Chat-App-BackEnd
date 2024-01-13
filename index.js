import http from 'http'
import app from './src/app.js'
import dotenv from 'dotenv'
import socketSever from './src/Socket/index.js'
import './src/Config/Mongo.js'

dotenv.config()

const server =http.createServer(app)

server.listen(process.env.PORT , () => console.log("server successfully connected"));

socketSever.attach(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
})