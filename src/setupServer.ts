import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import compression from 'compression';

export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startSever(this.app);
    // this.createSocketIO(this.app)
    // this.startHttpServer(this.app)
  }

  // ** Middleware **

  private securityMiddleware(app: Application): void {
    this.app.use(
      cookieSession({
        name: 'session',
        keys: ['test1', 'test2'],
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false, // NOTE: set to true in production
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: '*', // NOTE: set the client origin in production
        credentials: true, // if true, the server will accept the cookie
        optionsSuccessStatus: HTTP_STATUS.OK,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    this.app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }
  private routesMiddleware(app: Application): void {}

  // ** When any error occur it's send to the client side
  private globalErrorHandler(app: Application): void {}

  private startSever(app: Application): void {}

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {}
}
