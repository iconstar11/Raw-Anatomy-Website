import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronRight, Globe, Play } from 'lucide-react';
import MarkdownViewer from './components/MarkdownViewer';

// Dynamically import all markdown files from the content directory
const contentFiles = import.meta.glob('./content/*.md', { query: '?raw', eager: true });

interface ArticleMetadata {
  slug: string;
  title: string;
  content: string;
}

const articles: ArticleMetadata[] = Object.entries(contentFiles).map(([path, content]) => {
  const slug = path.split('/').pop()?.replace('.md', '') || '';
  const articleContent = content as string;
  // Simple title extraction from the first line of markdown
  const titleLine = articleContent.split('\n').find((line: string) => line.startsWith('# '));
  const title = titleLine ? titleLine.replace('# ', '').trim() : slug;
  
  return {
    slug,
    title,
    content: articleContent,
  };
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              RA
            </div>
            <span className="text-xl font-bold tracking-tight text-white">RawAnatomy</span>
          </Link>

          <div className="hidden items-center space-x-6 md:flex">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Globe className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Play className="h-5 w-5" />
            </a>
          </div>

          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Sidebar / Mobile Menu */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-800 bg-[#0f172a] transition-transform duration-300 ease-in-out md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col pt-20 pb-6 px-4">
          <div className="mb-4 flex items-center space-x-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <BookOpen className="h-3 w-3" />
            <span>Research Archive</span>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {articles.map((article) => (
              <Link
                key={article.slug}
                to={`/a/${article.slug}`}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === `/a/${article.slug}`
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span className="truncate">{article.title}</span>
                <ChevronRight className={`h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 ${location.pathname === `/a/${article.slug}` ? 'opacity-100' : ''}`} />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16 md:pl-72">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

const Home = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
      Raw Research for <span className="text-blue-500">YouTube Shorts</span>
    </h1>
    <p className="max-w-2xl text-lg text-slate-400">
      Deep dives, technical breakdowns, and raw notes from my research process. 
      Select an article from the sidebar to begin.
    </p>
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
       {articles.slice(0, 4).map(article => (
         <Link 
           key={article.slug} 
           to={`/a/${article.slug}`}
           className="flex flex-col items-start rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-blue-500/50 hover:bg-slate-900"
         >
           <span className="mb-2 text-xs font-bold text-blue-500 uppercase">Latest Research</span>
           <h3 className="text-xl font-bold text-white">{article.title}</h3>
         </Link>
       ))}
    </div>
  </div>
);

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Article not found</h2>
        <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">Return home</Link>
      </div>
    );
  }

  return <MarkdownViewer content={article.content} />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a/:slug" element={<ArticleView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
