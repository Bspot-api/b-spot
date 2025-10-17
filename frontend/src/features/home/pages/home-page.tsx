import { AppVersion, Header } from '@/components/shared';
import { HomeContent } from '@/features/home/home-content';

export function HomePage() {
  return (
    <div>
      <Header />
      <HomeContent />
      <AppVersion />
    </div>
  );
} 