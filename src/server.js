import path from "path"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import useragent from "express-useragent"
import { RedisStore } from "connect-redis"
import { fileURLToPath } from "url";


import connectDb from "./database/db.config.js"
import setupSwagger from "./config/swagger.config.js"
import passport from "../src/config/passport.config.js"

import urlRouter from "./routes/url.routes.js"
import authRoutes from "./routes/auth.routes.js"
import analyticsRouter from "./routes/analytics.routes.js"
import redisClient from "./config/redis.config.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4123;

const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
})

app.use(express.json());
app.use(
    cors({
        origin: "https://clickbiteshort.netlify.app",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
); app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(useragent.express());
connectDb()
app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'gowthamSecrt',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

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