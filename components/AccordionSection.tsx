
import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from './icons';

interface AccordionSectionProps {
    title: string;
    children: ReactNode;
    startOpen?: boolean;
    isProper?: boolean;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, startOpen = false, isProper = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    const headerBaseClasses = "cursor-pointer p-4 md:p-6 border-b border-slate-200 transition-colors duration-300 user-select-none";
    const headerBgClasses = isProper 
        ? "propers-section" 
        : "bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200";
    
    return (
        <div className={`accordion-section bg-white rounded-xl shadow-md mb-4 overflow-hidden ${isOpen ? 'open' : ''}`}>
            <div className={`${headerBaseClasses} ${headerBgClasses}`} onClick={() => setIsOpen(!isOpen)}>
                <h2 className="text-xl md:text-2xl font-semibold text-purple-900 font-crimson-pro flex justify-between items-center">
                    {title}
                    <span className="accordion-icon text-red-800">
                      <ChevronDownIcon />
                    </span>
                </h2>
            </div>
            <div className="accordion-content">
                <div className="p-4 md:p-8 text-gray-800 font-eb-garamond text-base md:text-lg leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionSection;
