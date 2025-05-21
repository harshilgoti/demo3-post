import express from "express";
import cors from "cors";
import cookie from "cookie-parser";
import { connectDb } from "./db/connect";
import userRoute from "./routes/userRoutes";
import postRoute from "./routes/postRoute";

connectDb();
const app = express();
app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", userRoute);
app.use("/post", postRoute);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running up!! at ${process.env.PORT}`);
});
