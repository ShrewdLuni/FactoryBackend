import express from "express";
import router from "routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import logging from "middleware/logging";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(logging);

app.use("/api", router);

app.get("test", async (req: express.Request, res:express.Response) => {return res.status(200).json({"message": "Server is up"})});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
