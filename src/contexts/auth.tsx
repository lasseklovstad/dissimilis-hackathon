import React from 'react';
import { createContext, useContext, useEffect, useState, FC } from 'react';

export const AuthContext = createContext({
    token: "",
    isLoggedIn: false,
    setToken: (tokeanParam: string) => { },
    setIsLoggedIn: (isLoggedInParam: boolean) => { }
});

export const AuthContextProvider: FC = (props) => {
    let [token, privateSetToken] = useState("");
    let [isLoggedIn, privateSetIsLoggedIn] = useState(false);

    const setToken = (tokenParam: string) => {
        privateSetToken(tokenParam);
    }
    const setIsLoggedIn = (isLoggedInParam: boolean) => {
        privateSetIsLoggedIn(isLoggedInParam);
    }

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, setToken, setIsLoggedIn }}>
            {props.children}
        </AuthContext.Provider>
    )

};