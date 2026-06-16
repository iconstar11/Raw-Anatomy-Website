import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowLeft, Github, Youtube, Calendar, Clock, User } from 'lucide-react';
import MarkdownViewer from './components/MarkdownViewer';

// Dynamically import all markdown files from the content directory
const contentFiles = import.meta.glob('./content/*.md', { query: '?raw', eager: true });

interface ArticleMetadata {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
}

// Simple Frontmatter Parser
const parseFrontmatter = (rawContent: string) => {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = rawContent.match(frontmatterRegex);
  
  if (!match) return { metadata: {}, body: rawContent };
  
  const frontmatterBlock = match[1];
  const body = rawContent.replace(match[0], '').trim();
  const metadata: any = {};
  
  frontmatterBlock.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      metadata[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  
  return { metadata, body };
};

const articles: ArticleMetadata[] = Object.entries(contentFiles).map(([path, content]) => {
  const slug = path.split('/').pop()?.replace('.md', '') || '';
  const rawContent = (content as { default: string }).default;
  const { metadata, body } = parseFrontmatter(rawContent);
  
  return {
    slug,
    title: metadata.title || slug,
    description: metadata.description || '',
    author: metadata.author || 'Anonymous',
    date: metadata.date || '',
    readTime: metadata.readTime || '',
    content: body,
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
  </svg>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] font-bold text-white transition-transform group-hover:scale-105">
              RA
            </div>
            <span className="text-xl font-bold tracking-tight font-display">RawAnatomy</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--color-surface-offset)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <div className="hidden items-center space-x-4 sm:flex border-l border-[var(--color-border)] pl-4 ml-4">
              <a href="https://github.com/iconstar11" target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@RawAnatomy_1" target="_blank" rel="noreferrer" className="text-[#FF0000] hover:opacity-80 transition-opacity">
                <YoutubeIcon className="h-6 w-6" />
              </a>
            </div>
            
            <button 
              className="sm:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-[var(--color-bg)] transition-transform duration-300 sm:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-display font-bold">
           <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
           <div className="flex space-x-6 pt-4">
              <a href="https://github.com/iconstar11" target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"><GithubIcon className="h-8 w-8" /></a>
              <a href="https://www.youtube.com/@RawAnatomy_1" target="_blank" rel="noreferrer" className="text-[#FF0000] hover:opacity-80 transition-opacity"><YoutubeIcon className="h-8 w-8" /></a>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {children}
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-[var(--color-border)] py-10 text-center text-[var(--color-text-muted)] text-sm">
        <p>© {new Date().getFullYear()} RawAnatomy. Evidence-based research for performance.</p>
      </footer>
    </div>
  );
};

const Home = () => (
  <div className="animate-fade-in">
    <div className="mb-16 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight font-display sm:text-6xl text-[var(--color-text)]">
        The Anatomy of <span className="text-[var(--color-primary)]">Performance</span>
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-muted)]">
        Deep dives, technical breakdowns, and evidence-based reviews from my research process. 
        Raw data, formatted for clarity.
      </p>
    </div>
    
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
       {articles.map(article => (
         <Link 
           key={article.slug} 
           to={`/a/${article.slug}`}
           className="flex flex-col h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-all hover:border-[var(--color-primary)] hover:shadow-lg group"
         >
           <div className="flex items-center space-x-4 mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
             <Calendar className="h-3 w-3" />
             <span>{article.date}</span>
             <span className="text-[var(--color-divider)]">•</span>
             <Clock className="h-3 w-3" />
             <span>{article.readTime}</span>
           </div>
           <h3 className="text-2xl font-bold font-display text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
             {article.title}
           </h3>
           <p className="text-[var(--color-text-muted)] line-clamp-3 mb-6 flex-grow leading-relaxed">
             {article.description}
           </p>
           <div className="flex items-center text-sm font-bold text-[var(--color-primary)] mt-auto">
             Read Full Review
             <ArrowLeft className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
           </div>
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
      <div className="py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold font-display text-[var(--color-text)]">Review not found</h2>
        <Link to="/" className="mt-4 inline-flex items-center text-[var(--color-primary)] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return home
        </Link>
      </div>
    );
  }

  return (
    <article className="animate-fade-in max-w-3xl mx-auto">
      <header className="mb-12 border-b border-[var(--color-border)] pb-12 text-center">
        <div className="flex items-center justify-center space-x-4 mb-6 text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          <span>{article.date}</span>
          <span className="text-[var(--color-divider)]">/</span>
          <span>{article.readTime}</span>
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight font-display sm:text-5xl lg:text-6xl text-[var(--color-text)]">
          {article.title}
        </h1>
        <p className="text-xl text-[var(--color-text-muted)] leading-relaxed italic mb-8">
          {article.description}
        </p>
        <div className="flex items-center justify-center space-x-3 text-sm text-[var(--color-text-muted)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-offset)]">
            <User className="h-4 w-4" />
          </div>
          <span>By <strong>{article.author}</strong></span>
        </div>
      </header>
      
      <MarkdownViewer content={article.content} />
      
      <footer className="mt-20 pt-12 border-t border-[var(--color-border)]">
        <Link to="/" className="inline-flex items-center text-[var(--color-primary)] font-bold hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Research Archive
        </Link>
      </footer>
    </article>
  );
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
