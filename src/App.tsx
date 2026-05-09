import { useNavigate } from 'react-router-dom';
import { Monitor, LayoutDashboard, Utensils, FileText } from 'lucide-react';
import Button from './components/common/Button';
import ThemeToggle from './components/common/ThemeToggle';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 transition-colors duration-400 bg-base-200 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl flex justify-between items-center mb-16">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-primary">Kindee POS</h1>
          <p className="text-base-content/60 mt-2 font-medium">Professional Restaurant Management System</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {/* POS Button */}
        <button
          className="group relative h-72 bg-base-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 overflow-hidden border border-base-300"
          onClick={() => navigate('/pos')}
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
            <Monitor size={48} strokeWidth={1.5} />
          </div>
          <span className="text-2xl font-bold">POS System</span>
        </button>

        {/* Backoffice Button */}
        <button
          className="group relative h-72 bg-base-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 overflow-hidden border border-base-300"
          onClick={() => navigate('/admin')}
        >
          <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-5 rounded-2xl bg-base-200 text-base-content group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
            <LayoutDashboard size={48} strokeWidth={1.5} />
          </div>
          <span className="text-2xl font-bold">Backoffice</span>
        </button>

        {/* Kitchen Button */}
        <button
          className="group relative h-72 bg-base-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 overflow-hidden border border-base-300"
          onClick={() => navigate('/kitchen')}
        >
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-5 rounded-2xl bg-base-200 text-base-content group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
            <Utensils size={48} strokeWidth={1.5} />
          </div>
          <span className="text-2xl font-bold">Kitchen</span>
        </button>

        {/* Report Button */}
        <button
          className="group relative h-72 bg-base-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 overflow-hidden border border-base-300"
          onClick={() => navigate('/report/day-end')}
        >
          <div className="absolute inset-0 bg-neutral/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-5 rounded-2xl bg-base-200 text-base-content group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
            <FileText size={48} strokeWidth={1.5} />
          </div>
          <span className="text-2xl font-bold">Reports</span>
        </button>
      </div>
      
      <div className="mt-20 text-base-content/40 text-sm font-medium">
        &copy; 2026 Kindee POS Technologies. All rights reserved.
      </div>
    </div>
  );
};

export default App;
