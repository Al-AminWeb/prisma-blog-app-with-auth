import express, {Application} from "express"
import {postRouter} from "./modules/post/post.router";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./lib/auth";
import cors from "cors";


const app: Application = express()

app.use(cors({
    origin: process.env.APP_URL,
    credentials:true,
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use('/post', postRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!")
})

export default app;