import express from "express";
import clientRouter from "./routes/client.route.js";

const app = express();

app.use(express.json());

app.use("/client", clientRouter);

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
