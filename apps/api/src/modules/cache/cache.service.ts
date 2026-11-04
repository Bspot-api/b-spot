import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PappersCache } from './pappers-cache.entity';
import { ApiUsageLog, ExternalApi } from './api-usage-log.entity';
import { EmailService } from './email.service';

const QUOTA_LIMIT = 250;
const QUOTA_WARNING_THRESHOLD = 200;
const DEFAULT_PAPPERS_CACHE_TTL_DAYS = 30;

export interface QuotaStatus {
  used: number;
  limit: number;
  remaining: number;
  warningThreshold: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly pappersCacheTtlMs = this.getPappersCacheTtlDays() * 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(PappersCache)
    private readonly pappersCacheRepo: EntityRepository<PappersCache>,
    @InjectRepository(ApiUsageLog)
    private readonly apiUsageLogRepo: EntityRepository<ApiUsageLog>,
    private readonly emailService: EmailService,
  ) {}

  async getCachedPappers(siren: string): Promise<Record<string, unknown> | null> {
    const cached = await this.pappersCacheRepo.findOne({ siren });
    if (!cached) return null;
    if (cached.expiresAt < new Date()) return null;
    return cached.responseData;
  }

  async setCachedPappers(siren: string, data: Record<string, unknown>): Promise<void> {
    const now = new Date();
    const existing = await this.pappersCacheRepo.findOne({ siren });

    if (existing) {
      existing.responseData = data;
      existing.fetchedAt = now;
      existing.expiresAt = new Date(now.getTime() + this.pappersCacheTtlMs);
      await this.pappersCacheRepo.getEntityManager().flush();
    } else {
      const entry = this.pappersCacheRepo.create({
        siren,
        responseData: data,
        fetchedAt: now,
        expiresAt: new Date(now.getTime() + this.pappersCacheTtlMs),
      });
      await this.pappersCacheRepo.getEntityManager().persistAndFlush(entry);
    }
  }

  async isCacheValid(siren: string): Promise<boolean> {
    const cached = await this.pappersCacheRepo.findOne({ siren });
    if (!cached) return false;
    return cached.expiresAt >= new Date();
  }

  async getMonthlyApiUsage(api: ExternalApi): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.apiUsageLogRepo.count({
      api,
      timestamp: { $gte: startOfMonth },
    });
  }

  async logApiCall(
    api: ExternalApi,
    endpoint: string,
    params: string | null,
    success: boolean,
    errorMessage?: string,
  ): Promise<void> {
    const log = this.apiUsageLogRepo.create({
      api,
      endpoint,
      requestParams: params ?? undefined,
      success,
      errorMessage,
      timestamp: new Date(),
    });
    await this.apiUsageLogRepo.getEntityManager().persistAndFlush(log);
  }

  async checkPappersQuota(): Promise<QuotaStatus> {
    const used = await this.getMonthlyApiUsage(ExternalApi.PAPPERS);
    const remaining = Math.max(0, QUOTA_LIMIT - used);

    if (used >= QUOTA_WARNING_THRESHOLD) {
      this.logger.warn(`Pappers quota warning: ${used}/${QUOTA_LIMIT} calls used this month`);
      await this.emailService.sendQuotaAlert(used).catch((err: unknown) => {
        this.logger.error('Failed to send quota alert email', err);
      });
    }

    return { used, limit: QUOTA_LIMIT, remaining, warningThreshold: QUOTA_WARNING_THRESHOLD };
  }

  async isPappersQuotaExhausted(): Promise<boolean> {
    const used = await this.getMonthlyApiUsage(ExternalApi.PAPPERS);
    return used >= QUOTA_LIMIT;
  }

  private getPappersCacheTtlDays(): number {
    const raw = process.env.PAPPERS_CACHE_TTL_DAYS;
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return DEFAULT_PAPPERS_CACHE_TTL_DAYS;
    }

    return parsed;
  }
}
