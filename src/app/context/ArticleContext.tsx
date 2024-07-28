"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ArticleContextType {
  articleId: string | null;
  setArticleId: (id: string | null) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const useArticleContext = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticleContext must be used within an ArticleProvider');
  }
  return context;
};

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [articleId, setArticleId] = useState<string | null>(null);

  return (
    <ArticleContext.Provider value={{ articleId, setArticleId }}>
      {children}
    </ArticleContext.Provider>
  );
};
