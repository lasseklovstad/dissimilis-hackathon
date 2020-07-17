import React from 'react';
import { createContext, useContext, useEffect, useState, FC } from 'react';

export const AuthContext = createContext({
    token: "",
    loggedIn: false,
    setToken: (token: string) => { },
    setLoggedIn: (loggedIn: boolean) => { }
});
