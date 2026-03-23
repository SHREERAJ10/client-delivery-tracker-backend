import express from "express";
import clientRouter from "./routes/client.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173"
}))
app.use("/client", clientRouter);
app.use("/dashboard", dashboardRouter);

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
