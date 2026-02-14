import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettings } from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        general: {
            siteName: 'Internship Platform',
            dateFormat: 'MM/DD/YYYY'
        },
        appearance: {
            primaryColor: '#3B82F6',
            theme: 'light'
        }
    });
    const [loading, setLoading] = useState(true);

    const loadSettings = async () => {
        try {
            const res = await fetchSettings();
            if (res.success && res.data && res.data.data) {
                const newSettings = res.data.data;
                setSettings(newSettings);
                applySettings(newSettings);
            }
        } catch (error) {
            console.error('Failed to load global settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const applySettings = (data) => {
        // Apply Site Name
        if (data.general?.siteName) {
            document.title = data.general.siteName;
        }

        // Apply Primary Color
        if (data.appearance?.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', data.appearance.primaryColor);
        }

        // Apply Theme (if needed)
        if (data.appearance?.theme) {
            if (data.appearance.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const formatDate = (date, options = {}) => {
        if (!date) return '';
        const d = new Date(date);
        const format = settings.general?.dateFormat || 'MM/DD/YYYY';

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        let formattedDate = '';
        switch (format) {
            case 'DD/MM/YYYY':
                formattedDate = `${day}/${month}/${year}`;
                break;
            case 'YYYY-MM-DD':
                formattedDate = `${year}-${month}-${day}`;
                break;
            case 'MM/DD/YYYY':
            default:
                formattedDate = `${month}/${day}/${year}`;
                break;
        }

        if (options.includeTime) {
            const hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${formattedDate} ${displayHours}:${minutes} ${ampm}`;
        }

        if (options.onlyTime) {
            const hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes} ${ampm}`;
        }

        return formattedDate;
    };

    const value = {
        settings,
        loading,
        refreshSettings: loadSettings,
        formatDate
    };
    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
