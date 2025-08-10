
import React from 'react';
import { LiturgicalDate } from '../types';

interface HeaderProps {
    liturgicalDate: LiturgicalDate;
}

const Header: React.FC<HeaderProps> = ({ liturgicalDate }) => {
    return (
        <>
            <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-crimson-pro">{liturgicalDate.feastTitle}</h1>
                <p className="text-xl text-gray-600 font-eb-garamond">{liturgicalDate.dateLong}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-sm font-eb-garamond">
                <span className="rubric px-3 py-1 bg-red-50 rounded-full">
                    Class: {liturgicalDate.rank}
                </span>
                <span className="rubric px-3 py-1 bg-red-50 rounded-full capitalize">
                    Color: {liturgicalDate.liturgicalColor}
                </span>
                {liturgicalDate.commemorations && (
                    <span className="rubric px-3 py-1 bg-red-50 rounded-full">
                        Commemoration: {liturgicalDate.commemorations}
                    </span>
                )}
            </div>
        </>
    );
};

export default Header;
