// ** Importing all packages **

import {
	Application,
	json,
	urlencoded,
	Response,
	Request,
	NextFunction,
} from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
import compression from "compression";
import { config } from "./config";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const SERVER_PORT = 5000;

export class ChattyServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	// ** Starting the server and all the middlewares **
	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startSever(this.app);
	}

	// ** Middleware **

	private securityMiddleware(app: Application): void {
		app.use(
			cookieSession({
				name: "session",
				keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				secure: config.NODE_ENV !== "development" ? true : false, // NOTE: set to true in production
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: config.CLIENT_URL, // NOTE: set the client origin in production
				credentials: true, // if true, the server will accept the cookie
				optionsSuccessStatus: HTTP_STATUS.OK,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			})
		);
	}

	// ** Standard middlewares ** mostly used for parsing the body of the request
	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({ limit: "50mb" }));
		app.use(urlencoded({ extended: true, limit: "50mb" }));
	}
	private routesMiddleware(app: Application): void {}

	// ** When any error occur it's send to the client side
	private globalErrorHandler(app: Application): void {}

	private async startSever(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIO: Server = await this.createSocketIO(httpServer);

			this.startHttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (error) {
			console.log(error);
		}
	}

	private async createSocketIO(httpServer: http.Server): Promise<Server> {
		// ** Socket.io  ** // NOTE: set the client origin in production

		const io: Server = new Server(httpServer, {
			cors: {
				origin: config.CLIENT_URL,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			},
		});

		// ** Redis adapter **
		const pubClient = createClient({
			url: config.REDIS_HOST,
		});

		const subClient = pubClient.duplicate();

		await Promise.all([pubClient.connect(), subClient.connect()]);

		io.adapter(createAdapter(pubClient, subClient));

		return io;
	}

	private startHttpServer(httpServer: http.Server): void {
		console.log(`Server has started with process ${process.pid}`);
		httpServer.listen(SERVER_PORT, () => {
			console.log(`Server is running on port ${SERVER_PORT}`);
		});
	}

	private socketIOConnections(io: Server): void {}
}
