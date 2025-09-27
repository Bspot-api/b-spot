import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);
    setSuccess(undefined);

    // Validation
    if (newPassword !== confirmPassword) {
      setError(t('pages.account.changePassword.errors.passwordsMismatch'));
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError(t('pages.account.changePassword.errors.passwordTooShort'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('pages.account.changePassword.errors.changeError'));
      }

      setSuccess(t('pages.account.changePassword.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('pages.account.changePassword.errors.generalError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 pt-6 border-t">
      <h3 className="text-lg font-semibold">{t('pages.account.changePassword.title')}</h3>
      
      <div className="space-y-2">
        <Label htmlFor="currentPassword">{t('pages.account.changePassword.currentPassword')}</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            disabled={isLoading}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">{t('pages.account.changePassword.newPassword')}</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowNewPassword(!showNewPassword)}
            disabled={isLoading}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('pages.account.changePassword.confirmPassword')}</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
          {success}
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? t('pages.account.changePassword.loading') : t('pages.account.changePassword.submit')}
      </Button>
    </form>
  );
} 