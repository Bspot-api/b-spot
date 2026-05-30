import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const QUOTA_LIMIT = 250;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private createTransport(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMagicLink(params: { to: string; url: string }): Promise<void> {
    const transporter = this.createTransport();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from,
      to: params.to,
      subject: '[B-Spot] Lien de connexion admin',
      text: [
        'Bonjour,',
        '',
        "Cliquez sur le lien ci-dessous pour vous connecter à l'administration B-Spot :",
        params.url,
        '',
        "Ce lien expire dans 24 heures et ne peut être utilisé qu'une seule fois.",
      ].join('\n'),
      html: [
        '<p>Bonjour,</p>',
        "<p>Cliquez sur le lien ci-dessous pour vous connecter à l'administration B-Spot :</p>",
        `<p><a href="${params.url}">${params.url}</a></p>`,
        "<p>Ce lien expire dans 24 heures et ne peut être utilisé qu'une seule fois.</p>",
      ].join(''),
    });

    this.logger.log(`Magic link sent to ${params.to}`);
  }

  async sendQuotaAlert(usage: number): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      this.logger.warn('ADMIN_EMAIL not configured — skipping quota alert');
      return;
    }

    const transporter = this.createTransport();
    const remaining = QUOTA_LIMIT - usage;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: `[B-Spot] Alerte quota Pappers API — ${usage}/${QUOTA_LIMIT} appels`,
      text: [
        `⚠️ Alerte quota Pappers API`,
        ``,
        `Utilisation ce mois : ${usage} / ${QUOTA_LIMIT} appels`,
        `Restant : ${remaining} appels`,
        ``,
        `Le cache Pappers est actif. Les données existantes resteront disponibles.`,
        `Pensez à surveiller l'utilisation pour éviter l'épuisement du quota.`,
      ].join('\n'),
    });

    this.logger.log(`Quota alert sent to ${adminEmail} (usage: ${usage}/${QUOTA_LIMIT})`);
  }
}
