import express from "express";
import "dotenv/config";
const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello clinton");
});

app.listen(PORT, () => {
  console.log("server is listen on port:", PORT);
});
