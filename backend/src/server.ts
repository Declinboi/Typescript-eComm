// import path from "path";
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB  from "../config/db";

const PORT = process.env.PORT;

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello clinton");
});

app.listen(PORT, () => {
  console.log("server is listen on port:", PORT);
});
