"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';


interface ContextProviderType {
  
  showSnackbar: boolean;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  snackbarMessage: string;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
}

const BlogContext = createContext<ContextProviderType | null>(null);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  return (
    <BlogContext.Provider value={{ showSnackbar, setShowSnackbar, snackbarMessage, setSnackbarMessage}}>
      {children}
    </BlogContext.Provider>
  );
};

export const useContextProvider = (): ContextProviderType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('Context provider don\'t work');
  }
  return context;
};
