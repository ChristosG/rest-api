import React, { createContext, useContext, useState } from 'react';

const SignUpContext = createContext<any>(null);

export const useSignUpContext = () => useContext(SignUpContext);

export const SignUpProvider: React.FC = ({ children }) => {
    const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
    const [someValue, setSomeValue] = useState('');

    const updateSignedUser = (newValue) => {
        setSomeValue(newValue);
    };

    return (
        <SignUpContext.Provider value={{
            isSignedUp, setIsSignedUp,
            someValue, updateSignedUser
        }}>
            {children}
        </SignUpContext.Provider>
    );
};


