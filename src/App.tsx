import { useNavigate } from 'react-router-dom';
import { Monitor, LayoutDashboard, Utensils, FileText } from 'lucide-react';
import Button from './components/common/Button';
import ThemeToggle from './components/common/ThemeToggle';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 transition-colors duration-300 bg-base-100 flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">Kassa</h1>
        <ThemeToggle />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-center max-w-7xl mx-auto w-full">
        {/* POS Button */}
        <Button
          className="w-full h-64 md:h-80 text-3xl flex flex-col gap-6 hover:scale-105 transition-transform shadow-xl"
          variant="primary"
          onClick={() => navigate('/pos')}
        >
          <Monitor className="w-20 h-20" />
          POS System
        </Button>

        {/* Backoffice Button */}
        <Button
          className="w-full h-64 md:h-80 text-3xl flex flex-col gap-6 hover:scale-105 transition-transform shadow-xl"
          variant="secondary"
          onClick={() => navigate('/admin')}
        >
          <LayoutDashboard className="w-20 h-20" />
          Backoffice
        </Button>

        {/* Kitchen Button */}
        <Button
          className="w-full h-64 md:h-80 text-3xl flex flex-col gap-6 hover:scale-105 transition-transform shadow-xl"
          variant="accent"
          onClick={() => navigate('/kitchen')}
        >
          <Utensils className="w-20 h-20" />
          Kitchen
        </Button>

        {/* Report Button */}
        <Button
          className="w-full h-64 md:h-80 text-3xl flex flex-col gap-6 hover:scale-105 transition-transform shadow-xl btn-neutral"
          variant="outline"
          onClick={() => navigate('/report/day-end')}
        >
          <FileText className="w-20 h-20" />
          Day End
        </Button>
      </div>
    </div>
  );
};

export default App;
