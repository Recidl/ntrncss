import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import OfflineIndicator from '@/components/OfflineIndicator';
import { ThemeProvider } from '@/components/nontronics/ThemeContext';
import { useEffect } from 'react';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-8 h-8 border-4 border-muted border-t-primary animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={
        <LayoutWrapper currentPageName="404">
          <PageNotFound />
        </LayoutWrapper>
      } />
    </Routes>
  );
};

function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const routerBase = baseUrl === '/' ? '/' : baseUrl.replace(/\/$/, '');

  // Register service worker for PWA support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${baseUrl}sw.js`).catch(err => {
        console.log('Service Worker registration failed:', err);
      });
    }
  }, [baseUrl]);

  // Quietly refresh app assets after reconnecting without forcing a page reload.
  useEffect(() => {
    const quietRefreshAssets = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map((registration) => registration.update().catch(() => null))
          );
        }

        const assetUrls = new Set();
        const collect = (selector, attribute) => {
          document.querySelectorAll(selector).forEach((el) => {
            const raw = el.getAttribute(attribute);
            if (!raw) return;
            try {
              const url = new URL(raw, window.location.origin);
              if (url.origin !== window.location.origin) return;
              url.searchParams.set('_refresh', `${Date.now()}`);
              assetUrls.add(url.toString());
            } catch {
              // Ignore malformed URLs
            }
          });
        };

        collect('link[rel="stylesheet"][href]', 'href');
        collect('script[src]', 'src');
        collect('img[src]', 'src');
        collect('source[src]', 'src');

        await Promise.all(
          Array.from(assetUrls).map((url) =>
            fetch(url, { method: 'GET', cache: 'no-store' }).catch(() => null)
          )
        );

        // Force-refresh embedded Google iframes (e.g., YouTube background and Maps)
        // so they recover from offline placeholders without a full page reload.
        document.querySelectorAll('iframe[src]').forEach((iframe) => {
          const rawSrc = iframe.getAttribute('src');
          if (!rawSrc) return;

          try {
            const iframeUrl = new URL(rawSrc, window.location.origin);
            const host = iframeUrl.hostname.toLowerCase();
            const isGoogleEmbed =
              host.includes('youtube.com') ||
              host.includes('youtu.be') ||
              host.includes('google.com') ||
              host.includes('googleapis.com') ||
              host.includes('gstatic.com');

            if (!isGoogleEmbed && iframeUrl.origin !== window.location.origin) {
              return;
            }

            iframeUrl.searchParams.set('_refresh', `${Date.now()}`);
            iframe.setAttribute('src', iframeUrl.toString());
          } catch {
            // Ignore malformed iframe URLs
          }
        });
      } catch {
        // Quiet refresh should never disrupt normal app flow.
      }
    };

    const handleOnline = () => {
      void quietRefreshAssets();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <OfflineIndicator />
          <Router basename={routerBase}>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
