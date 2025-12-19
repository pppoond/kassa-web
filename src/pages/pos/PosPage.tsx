import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle';

const PosPage = () => {
    return (
        <div className="min-h-screen p-8 transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">POS System</h1>
                <div className="flex gap-4 items-center">
                    <ThemeToggle />
                    <Link to="/" className="btn btn-ghost">Back to Home</Link>
                </div>
            </div>
            <div className="flex items-center justify-center h-[60vh]">
                <p className="text-2xl text-base-content/50">POS Functionality Coming Soon...</p>
            </div>
        </div>
    );
};

export default PosPage;
