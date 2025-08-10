
import React, { useState, useEffect, useCallback } from 'react';
import { MassData, DisplayMode } from './types';
import { fetchLiturgicalData } from './services/geminiService';
import Header from './components/Header';
import Mass from './components/Mass';
import SettingsPanel from './components/SettingsPanel';
import Spinner from './components/Spinner';
import { CogIcon, CloseIcon } from './components/icons';
import { useSettings } from './hooks/useSettings';

const App: React.FC = () => {
    const [massData, setMassData] = useState<MassData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

    const {
        displayMode,
        setFontSize,
        fontSize,
        setDisplayMode,
    } = useSettings();
    
    const getMassData = useCallback(async (date: string) => {
        setLoading(true);
        setError(null);
        setMassData(null);
        try {
            const data = await fetchLiturgicalData(new Date(date + 'T12:00:00Z')); // Use noon to avoid timezone issues
            setMassData(data);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getMassData(selectedDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    useEffect(() => {
        document.body.style.fontSize = `${fontSize}px`;
        if (displayMode === DisplayMode.INTERLINEAR) {
            document.body.classList.add('body-interlinear');
        } else {
            document.body.classList.remove('body-interlinear');
        }
    }, [fontSize, displayMode]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    const colorClass = massData ? `color-${massData.liturgicalDate.liturgicalColor}` : 'color-white';

    return (
        <div className={`${colorClass} bg-slate-100 min-h-screen`}>
            {isSettingsOpen && (
                <div 
                    className="settings-overlay fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSettingsOpen(false)}
                ></div>
            )}
            <SettingsPanel 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)}
                displayMode={displayMode}
                onDisplayModeChange={setDisplayMode}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
            />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="text-center mb-8 bg-white p-6 md:p-8 rounded-xl shadow-lg relative">
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
                        aria-label="Open settings"
                    >
                        <CogIcon />
                    </button>
                    <div className="mb-4">
                        <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <input
                            type="date"
                            id="date-picker"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    {massData && <Header liturgicalDate={massData.liturgicalDate} />}
                </header>

                <main>
                    {loading && <Spinner />}
                    {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
                    {massData && !loading && <Mass massData={massData} />}
                </main>
            </div>
        </div>
    );
};

export default App;
