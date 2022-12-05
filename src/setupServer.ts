// ** Importing all packages **

import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import compression from 'compression';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Logger from 'bunyan';
// ** Import all Custom Modules **
import { config } from '@root/config';
import applicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';

const SERVER_PORT = 5000;

const log: Logger = config.createLogger('server');

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
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: config.NODE_ENV !== 'development' ? true : false // NOTE: set to true in production
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL, // NOTE: set the client origin in production
        credentials: true, // if true, the server will accept the cookie
        optionsSuccessStatus: HTTP_STATUS.OK,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  // ** Standard middlewares ** mostly used for parsing the body of the request
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  // ** When any error occur it's send to the client side
  private globalErrorHandler(app: Application): void {
    // if route not found then run this middleware
    app.all('*', (req: Request, res: Response, _next: NextFunction) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: `Can't find ${req.originalUrl} on this server!`
      });
    });

    // if any error occur then run this middleware
    app.use((err: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(err);
      if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.serializeErrors());
      }
      next();
    });
  }

  private async startSever(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);

      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    // ** Socket.io  ** // NOTE: set the client origin in production

    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });

    // ** Redis adapter **
    const pubClient = createClient({
      url: config.REDIS_HOST
    });

    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));

    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server is running on port ${SERVER_PORT}`);
    });
  }

  private socketIOConnections(_io: Server): void {
    log.info('socketIOConnections running');
  }
}
