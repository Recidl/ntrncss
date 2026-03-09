const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const DOT_COUNT = 100;
const DURATION_MIN = 18;
const DURATION_MAX = 28;
const DELAY_MAX = 20;

function useBlackholeDots() {
  return useMemo(() => {
    return Array.from({ length: DOT_COUNT }, (_, i) => {
      const seed = (i * 7919) % 9973;
      const x = 10 + (seed % 81);
      const y = 10 + ((seed * 31) % 81);
      const duration = DURATION_MIN + (seed % (DURATION_MAX - DURATION_MIN + 1));
      const delay = -(seed % (DELAY_MAX + 1));
      return { id: i, x, y, duration, delay };
    });
  }, []);
}

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.substring(1) || '(home)';
  const dots = useBlackholeDots();

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await db.auth.me();
        return { user, isAuthenticated: true };
      } catch {
        return { user: null, isAuthenticated: false };
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Grid background (same as other pages) */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" aria-hidden />

      {/* Blackhole / space dots — faint purple, spiral toward center */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {dots.map(({ id, x, y, duration, delay }) => (
          <div
            key={id}
            className="dot-blackhole"
            style={{
              '--dot-x': x,
              '--dot-y': y,
              '--dot-duration': `${duration}s`,
              '--dot-delay': `${delay}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-muted-foreground/50">404</h1>
            <div className="h-0.5 w-16 bg-border mx-auto" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground leading-relaxed">
              The page <span className="font-medium text-foreground">&quot;{pageName}&quot;</span> could not be found.
            </p>
          </div>
          {isFetched && authData?.isAuthenticated && authData.user?.role === 'admin' && (
            <div className="mt-8 p-4 bg-muted/50 border border-border">
              <div className="flex items-start space-x-3 text-left">
                <div className="flex-shrink-0 w-5 h-5 bg-primary/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Admin Note</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This page may not be implemented yet. Ask the AI to implement it in the chat.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="pt-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-primary/10 border border-border hover:bg-primary/20 hover:border-primary/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}