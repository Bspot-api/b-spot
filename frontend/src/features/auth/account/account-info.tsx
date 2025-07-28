import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from 'react-i18next';

export function AccountInfo() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.account.accountInfo.title')}</CardTitle>
        <CardDescription>
          {t('pages.account.accountInfo.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* User info */}
          <div className="space-y-2">
            <Label>{t('pages.account.accountInfo.email')}</Label>
            <Input value={user?.email || ''} disabled />
          </div>
          
          <div className="space-y-2">
            <Label>{t('pages.account.accountInfo.name')}</Label>
            <Input value={user?.name || ''} disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 