import express, { Express } from "express";
import { ChattyServer } from "./setupServer";
import connectDB from "./setupDatabase";

class Application {
	public initialize(): void {
		connectDB();
		const app: Express = express();
		const server: ChattyServer = new ChattyServer(app);
		server.start();
	}
}

const application: Application = new Application();

application.initialize();
