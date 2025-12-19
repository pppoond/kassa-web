import { useNavigate } from 'react-router-dom';
import { Monitor, LayoutDashboard } from 'lucide-react';
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

      <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center max-w-6xl mx-auto w-full">
        {/* POS Button */}
        <Button
          className="flex-1 w-full h-64 md:h-96 text-4xl flex flex-col gap-6 hover:scale-105 transition-transform shadow-xl"
          variant="primary"
          onClick={() => navigate('/pos')}
        >
          <Monitor className="w-24 h-24" />
          POS System
        </Button>

        {/* Backoffice Button */}
        <Button
          className="flex-1 w-full h-64 md:h-96 text-4xl flex flex-col gap-6 hover:scale-105 transition-transform shadow-xl"
          variant="secondary"
          onClick={() => navigate('/admin')}
        >
          <LayoutDashboard className="w-24 h-24" />
          Backoffice
        </Button>
      </div>
    </div>
  );
};

export default App;
