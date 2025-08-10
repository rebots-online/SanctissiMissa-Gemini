
import React from 'react';

interface InteractiveTextProps {
    latin: string;
    english: string;
    speaker?: 'P' | 'S';
    isRubric?: boolean;
}

const InteractiveText: React.FC<InteractiveTextProps> = ({ latin, english, speaker, isRubric = false }) => {
    return (
        <p className="group relative my-2">
            {speaker && <span className={speaker === 'P' ? 'dialogue-priest' : 'dialogue-server'}>{speaker}. </span>}
            <span className={isRubric ? 'rubric' : 'cursor-pointer'}>{latin}</span>
            <span className="translation-popup invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-sm rounded-md px-3 py-2 z-10 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {english}
            </span>
        </p>
    );
};

export default InteractiveText;
