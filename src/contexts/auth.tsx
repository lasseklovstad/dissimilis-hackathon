import React from 'react';
import { createContext, useContext, useEffect, useState, FC } from 'react';

export const AuthContext = createContext({
    loggedIn: false,
    setLoggedIn: (loggedIn: boolean) => { }
});

