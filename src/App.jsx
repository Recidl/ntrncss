import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import OfflineIndicator from '@/components/OfflineIndicator';
import SiteNotificationDropdown from '@/components/SiteNotificationDropdown';
import GlobalLoadingIndicator from '@/components/GlobalLoadingIndicator';
import { ThemeProvider } from '@/components/nontronics/ThemeContext';
import { secureFetch } from '@/lib/http';
import { Suspense, useEffect } from 'react';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const isAppLoading = isLoadingPublicSettings || isLoadingAuth;

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
    <>
      <GlobalLoadingIndicator active={isAppLoading} />
      <Suspense fallback={<GlobalLoadingIndicator active />}>
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
      </Suspense>
    </>
  );
};

function App() {

  // Register service worker only in production. In dev, remove stale workers/caches.
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.log('Service Worker registration failed:', err);
        });
      } else {
        navigator.serviceWorker.getRegistrations()
          .then((registrations) => Promise.all(registrations.map((r) => r.unregister())))
          .catch(() => null);

        if ('caches' in window) {
          caches.keys()
            .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
            .catch(() => null);
        }
      }
    }
  }, []);

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
            secureFetch(url, {
              method: 'GET',
              cache: 'no-store',
              parseJson: false,
              timeoutMs: 5000,
              retries: 0,
            }).catch(() => null)
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
          <SiteNotificationDropdown />
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
