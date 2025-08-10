
import { useState, useEffect } from 'react';
import { DisplayMode } from '../types';

export const useSettings = () => {
    const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
        const savedMode = localStorage.getItem('displayMode');
        return (savedMode as DisplayMode) || DisplayMode.SIDE_BY_SIDE;
    });

    const [fontSize, setFontSizeState] = useState<number>(() => {
        const savedSize = localStorage.getItem('fontSize');
        return savedSize ? parseInt(savedSize, 10) : 16;
    });

    useEffect(() => {
        localStorage.setItem('displayMode', displayMode);
    }, [displayMode]);

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize.toString());
    }, [fontSize]);

    const setDisplayMode = (mode: DisplayMode) => setDisplayModeState(mode);
    const setFontSize = (size: number) => setFontSizeState(size);

    return {
        displayMode,
        setDisplayMode,
        fontSize,
        setFontSize,
    };
};
