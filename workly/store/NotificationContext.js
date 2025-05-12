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
            <Alert className={`fixed top-4 right-4 w-auto max-w-sm z-50 ${notification.type === 'error' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                <AlertDescription className={`${notification.type === 'error' ? 'text-red-800' : 'text-green-800'} flex justify-between items-center`}>
                    <span>{notification.message}</span>
                    <button
                        onClick={closeNotification}
                        className="ml-4 text-gray-500 hover:text-gray-700"
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