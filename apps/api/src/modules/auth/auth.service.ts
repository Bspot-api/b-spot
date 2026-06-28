import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Pool } from 'pg';
import type { BetterAuthInstance } from './auth.config';
import { AdminService } from './admin.service';
import { EmailService } from '../cache/email.service';

@Injectable()
export class AuthService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(AuthService.name);
  private _auth: BetterAuthInstance | null = null;
  private _pool: Pool | null = null;
  private _initPromise: Promise<void> | null = null;

  constructor(
    private readonly emailService: EmailService,
    private readonly adminService: AdminService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this._initPromise) {
      this._initPromise = this.initialize().catch((err) => {
        this._initPromise = null;
        throw err;
      });
    }
    await this._initPromise;
  }

  async onApplicationShutdown(): Promise<void> {
    await this._pool?.end();
  }

  private async initialize(): Promise<void> {
    const { createBetterAuth, getBetterAuthConfigFromEnv, buildDatabaseConnectionString } =
      await import('./auth.config');
    const config = getBetterAuthConfigFromEnv();
    const pool = new Pool({ connectionString: buildDatabaseConnectionString() });

    try {
      this._auth = createBetterAuth({
        ...config,
        pool,
        sendMagicLink: async (data) => {
          try {
            const isAdmin = await this.adminService.isAdminByEmail(data.email);
            if (!isAdmin) {
              this.logger.warn(`[Magic Link] Blocked for non-admin email: ${data.email}`);
              return;
            }
            await this.emailService.sendMagicLink({ to: data.email, url: data.url });
          } catch (err) {
            this.logger.error(`[Magic Link] Delivery error for ${data.email}`, err);
            throw err;
          }
        },
      });
      this._pool = pool;
    } catch (err) {
      await pool.end().catch(() => undefined);
      throw err;
    }
  }

  get auth(): BetterAuthInstance {
    if (!this._auth) {
      throw new ServiceUnavailableException('Auth service not ready');
    }
    return this._auth;
  }

  get api(): BetterAuthInstance['api'] {
    return this.auth.api;
  }
}
