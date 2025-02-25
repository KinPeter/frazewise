import { EmailUtils } from './email-utils';
import { HttpClient } from './http-client';
import { getEnv } from './environment';
import { DataBackup } from '../../common/types/backup';

class EmailData {
  public readonly apiKey: string;

  constructor(
    public to: string,
    public subject: string,
    public html: string,
    public attachmentContent?: string,
    public attachmentFilename?: string
  ) {
    this.apiKey = getEnv('MAILER_API_KEY')[0];
  }
}

export class MailerManager extends EmailUtils {
  private readonly mailerUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.http.setHeaders({ 'Content-Type': 'application/json' });
    this.mailerUrl = getEnv('MAILER_URL')[0];
  }

  public async sendLoginCode(email: string, loginCode: string): Promise<any> {
    const subject = `${loginCode} - Log in to FrazeWise`;
    const { html } = this.getLoginCodeTemplates(loginCode);
    const data = new EmailData(email, subject, html);
    return await this.sendMail(data);
  }

  public async sendSignupNotification(email: string): Promise<any> {
    const subject = 'A user signed up to FrazeWise';
    const { html } = this.getSignupNotificationTemplates(email);
    const data = new EmailData(email, subject, html);
    return await this.sendMail(data);
  }

  public async sendDataBackup(name: string, email: string, backup: DataBackup): Promise<any> {
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const subject = `Data backup for FrazeWise`;
    const { html } = this.getDataBackupTemplates(name);
    const filename = `frazewise-backup-${date}.json`;
    const content = JSON.stringify(backup);
    const data = new EmailData(email, subject, html, content, filename);
    return await this.sendMail(data);
  }

  private async sendMail(data: EmailData): Promise<any> {
    try {
      console.log(`[MailerManager] Sending email to ${data.to} via ${this.mailerUrl}`);
      const res = await this.http.post(this.mailerUrl, data);
      return { message: 'Attempted to send email', response: JSON.stringify(res) };
    } catch (error: any) {
      console.error('[MailerManager] Error in sendMail:');
      console.error(error);
      throw new Error(`[MailerManager] Unable to send email: ${JSON.stringify(error)}`);
    }
  }
}
