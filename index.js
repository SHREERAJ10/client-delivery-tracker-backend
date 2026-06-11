import express from "express";
import clientRouter from "./routes/client.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import projectRouter from "./routes/project.route.js";
import cors from "cors";
import verifyToken from "./middlewares/verifyToken.js";
import { getStatus } from "./controllers/status.controller.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://agencyflow-app.vercel.app",
  }),
);
app.use("/client", clientRouter);
app.use("/project", projectRouter);
app.use("/dashboard", dashboardRouter);
app.get("/status", verifyToken, getStatus);

app.get("/health", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
