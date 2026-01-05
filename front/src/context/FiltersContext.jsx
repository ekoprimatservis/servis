// FiltersContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
    // Load initial values from localStorage (or defaults if none)
    const [selectedFilters, setSelectedFilters] = useState(
        () => localStorage.getItem('selectedFilters') || 'Narudzbina | Ima sifru | Transport'
    );
    const [nameSurnameSearch, setNameSurnameSearch] = useState(
        () => localStorage.getItem('nameSurnameSearch') || ''
    );
    const [addressSearch, setAddressSearch] = useState(
        () => localStorage.getItem('addressSearch') || ''
    );
    const [additionalIdSearch, setAdditionalIdSearch] = useState(
        () => localStorage.getItem('additionalIdSearch') || ''
    );

    // Whenever state changes, save it to localStorage
    useEffect(() => {
        localStorage.setItem('selectedFilters', selectedFilters);
    }, [selectedFilters]);

    useEffect(() => {
        localStorage.setItem('nameSurnameSearch', nameSurnameSearch);
    }, [nameSurnameSearch]);

    useEffect(() => {
        localStorage.setItem('addressSearch', addressSearch);
    }, [addressSearch]);

    useEffect(() => {
        localStorage.setItem('additionalIdSearch', additionalIdSearch);
    }, [additionalIdSearch]);

    const value = {
        selectedFilters,
        setSelectedFilters,
        nameSurnameSearch,
        setNameSurnameSearch,
        addressSearch,
        setAddressSearch,
        additionalIdSearch,
        setAdditionalIdSearch,
    };

    return (
        <FiltersContext.Provider value={value}>
            {children}
        </FiltersContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FiltersContext);
    if (!context) {
        throw new Error('useFilters must be used within a FiltersProvider');
    }
    return context;
};