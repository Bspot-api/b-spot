import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { BetterAuthInstance } from './auth.config';
import { AdminService } from './admin.service';
import { EmailService } from '../cache/email.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private _auth: BetterAuthInstance | null = null;
  private static initPromise: Promise<void> | null = null;

  constructor(
    private readonly emailService: EmailService,
    private readonly adminService: AdminService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!AuthService.initPromise) {
      AuthService.initPromise = this.initialize();
    }
    await AuthService.initPromise;
  }

  private async initialize(): Promise<void> {
    if (this._auth) {
      return;
    }

    const { createBetterAuth, getBetterAuthConfigFromEnv } = await import('./auth.config');
    const config = getBetterAuthConfigFromEnv();

    this._auth = createBetterAuth({
      ...config,
      sendMagicLink: async (data) => {
        const isAdmin = await this.adminService.isAdminByEmail(data.email);
        if (!isAdmin) {
          this.logger.warn(
            `[Magic Link] Blocked request for non-admin or unknown email: ${data.email}`,
          );
          return;
        }

        await this.emailService.sendMagicLink({
          to: data.email,
          url: data.url,
        });
      },
    });
  }

  get auth(): BetterAuthInstance {
    if (!this._auth) {
      throw new Error('Auth not initialized — call onModuleInit first');
    }
    return this._auth;
  }

  get api(): BetterAuthInstance['api'] {
    return this.auth.api;
  }
}
