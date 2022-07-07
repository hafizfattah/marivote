import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./socket";

const port = 4000;
const host = "localhost";
const corsOrigin = "http://localhost:3000";

// const host = "https://marivote-hafizxfattah.vercel.app";
// const corsOrigin = "https://marivote-hafizxfattah.vercel.app:3000";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: corsOrigin,
		credentials: true,
	},
});

app.get("/", (req, res) =>
	res.send(`Hello World! ${host}: ${port} : ${corsOrigin}`)
);

httpServer.listen(port, host, () => {
	console.log(`Server ${host} listening on port ${port}`);
	socket({ io });
});
