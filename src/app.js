import express from "express";
import environments from "./config/environments.js";
import cors from 'cors'
import fs from 'fs'
import path from "path";
import morgan from "morgan";
import router from "./routes/index.js";
import './crone-jobs/index.js'
const app = express();
const { PORT } = environments;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())
let accessLogStream = fs.createWriteStream(
  path.join(process.cwd(), "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

app.use(router)

app.listen(PORT, () => {
  console.log(`Server is Running ${PORT} port`);
});
