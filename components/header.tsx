import { getClaims } from '@/lib/supabase/server';
import { AuthButton } from '@/components/auth-button';
import { HeaderBar } from '@/components/header-bar';

export async function Header() {
  const user = await getClaims();

  const authUser = user
    ? { email: user.email ?? '', avatarUrl: user.user_metadata?.avatar_url ?? null }
    : null;

  return <HeaderBar authUser={authUser} />;
}
