import { Component, ReactNode, useEffect } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider, useApp } from './store/AppContext';
import Home from './pages/Home';
import Topics from './pages/Topics';
import DailyWords from './pages/DailyWords';
import Review from './pages/Review';
import Journal from './pages/Journal';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Wall from './pages/Wall';
import { Paper } from './components/ui';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <Paper tape="rose" className="px-6 pb-6 pt-8 text-center">
          <h1 className="font-display text-3xl">Oops, a page got crumpled</h1>
          <p className="mt-2 text-[var(--ink-soft)]">Something went wrong while showing this page. Your saved progress is safe.</p>
          <button className="btn btn-ink mt-5" onClick={() => { this.setState({ error: null }); window.location.hash = '#/'; }}>
            Back to home
          </button>
        </Paper>
      </div>
    );
  }
}

function ThemeSync() {
  const { data } = useApp();
  useEffect(() => {
    document.documentElement.dataset.theme = data.settings.theme;
  }, [data.settings.theme]);
  return null;
}

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-4xl">This page got lost on the journey</h1>
      <Link to="/" className="btn btn-ink mt-6">Take me home</Link>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeSync />
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="topics" element={<Topics />} />
              <Route path="words" element={<DailyWords />} />
              <Route path="review" element={<Review />} />
              <Route path="journal" element={<Journal />} />
              <Route path="progress" element={<Progress />} />
              <Route path="settings" element={<Settings />} />
              <Route path="wall" element={<Wall />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
