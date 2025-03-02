'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { queryClient, tsr } from './api';

export function ApiProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
}