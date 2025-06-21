import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { getCurrentUser } from '../api/endpoints';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    getCurrentUserProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const getCurrentUserProfile = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data)
        } catch (err) {
            console.log("Error: ", err)
            setUser(null)
            // setServerError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    useEffect(() => {
        getCurrentUserProfile();
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, getCurrentUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
