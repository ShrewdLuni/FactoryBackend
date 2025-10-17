import express from "express";
import router from "routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use("/api", router);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
