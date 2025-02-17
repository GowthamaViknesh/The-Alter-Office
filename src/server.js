import path from "path"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import useragent from "express-useragent"
import { fileURLToPath } from "url";


import connectDb from "./database/db.config.js"
import setupSwagger from "./config/swagger.config.js"
import passport from "../src/config/passport.config.js"

import urlRouter from "./routes/url.routes.js"
import authRoutes from "./routes/auth.routes.js"
import analyticsRouter from "./routes/analytics.routes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4123;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(useragent.express());
connectDb()
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());
setupSwagger(app);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "./views")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api", urlRouter);
app.use("/api/analytics", analyticsRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});