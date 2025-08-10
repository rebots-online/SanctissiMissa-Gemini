
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-800"></div>
            <p className="ml-4 text-lg text-gray-700 font-eb-garamond">Loading Liturgical Data...</p>
        </div>
    );
};

export default Spinner;
