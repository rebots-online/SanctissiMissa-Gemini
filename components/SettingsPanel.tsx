
import React from 'react';
import { CloseIcon } from './icons';
import { DisplayMode } from '../types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    displayMode: DisplayMode;
    onDisplayModeChange: (mode: DisplayMode) => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    isOpen, 
    onClose, 
    displayMode, 
    onDisplayModeChange,
    fontSize,
    onFontSizeChange
}) => {
    return (
        <div className={`settings-panel fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 p-6 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 font-crimson-pro">Settings</h3>
                <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800" aria-label="Close settings">
                    <CloseIcon />
                </button>
            </div>
            
            <div className="space-y-8 font-eb-garamond text-lg">
                <div>
                    <h4 className="font-semibold mb-3 text-gray-700">Display Mode</h4>
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="displayMode" 
                                value={DisplayMode.SIDE_BY_SIDE}
                                checked={displayMode === DisplayMode.SIDE_BY_SIDE}
                                onChange={() => onDisplayModeChange(DisplayMode.SIDE_BY_SIDE)}
                                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300" 
                            />
                            <span>Side-by-Side</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="displayMode" 
                                value={DisplayMode.INTERLINEAR}
                                checked={displayMode === DisplayMode.INTERLINEAR}
                                onChange={() => onDisplayModeChange(DisplayMode.INTERLINEAR)}
                                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            />
                            <span>Interlinear (Hover/Tap)</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-semibold mb-3 text-gray-700">Font Size</h4>
                    <input 
                        type="range" 
                        id="fontSizeSlider" 
                        min="14" 
                        max="24" 
                        value={fontSize}
                        onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="text-center text-gray-600 mt-2">
                        <span>{fontSize}px</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
