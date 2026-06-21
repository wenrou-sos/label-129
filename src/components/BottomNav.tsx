import { Home, BarChart3, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { TabType } from '../types';

const tabs: { id: TabType; label: string; icon: React.ReactNode; path: string }[] = [
  { id: 'home', label: '首页', icon: <Home className="w-5 h-5" />, path: '/' },
  { id: 'compare', label: '健康对比', icon: <BarChart3 className="w-5 h-5" />, path: '/compare' },
  { id: 'calendar', label: '医疗日历', icon: <Calendar className="w-5 h-5" />, path: '/calendar' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): TabType => {
    const path = location.pathname;
    if (path.startsWith('/compare')) return 'compare';
    if (path.startsWith('/calendar')) return 'calendar';
    if (path.startsWith('/visit/')) return 'home';
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === tab.id
                ? 'text-primary-500'
                : 'text-surface-400 hover:text-surface-600'
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            <div
              className={`mb-0.5 transition-transform ${
                activeTab === tab.id ? 'scale-110' : ''
              }`}
            >
              {tab.icon}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
