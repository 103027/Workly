import React, { createContext, useContext, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);

    const showNotification = (message, type = 'success', duration = 3000) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setNotification({ message, type });
        const newTimeoutId = setTimeout(() => {
            setNotification(null);
        }, duration);

        setTimeoutId(newTimeoutId);
    };

    const closeNotification = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setNotification(null);
    };

    const NotificationComponent = () => {
        if (!notification) return null;

        return (
            <Alert className={`fixed top-4 right-4 w-auto max-w-sm z-50 shadow-lg ${notification.type === 'error'
                    ? 'bg-red-500 border-red-700 text-white'
                    : 'bg-green-500 border-green-700 text-white'
                }`}>
                <AlertDescription className="flex justify-between items-center font-medium">
                    <span>{notification.message}</span>
                    <button
                        onClick={closeNotification}
                        className="ml-4 text-white hover:text-gray-200 font-bold text-xl"
                        aria-label="Close notification"
                    >
                        &times;
                    </button>
                </AlertDescription>
            </Alert>
        );
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <NotificationComponent />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};