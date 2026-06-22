'use client';

import { useEffect, useState } from 'react';
import type { User as SupaUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: SupaUser | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      const role = user?.user_metadata?.role ?? user?.app_metadata?.role ?? 'customer';
      setState({
        user,
        session,
        loading: false,
        isAdmin: role === 'admin' || role === 'super_admin',
      });
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        const role = user?.user_metadata?.role ?? user?.app_metadata?.role ?? 'customer';
        setState({
          user,
          session,
          loading: false,
          isAdmin: role === 'admin' || role === 'super_admin',
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
