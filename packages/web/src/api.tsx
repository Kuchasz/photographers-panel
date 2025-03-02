
import { siteContract } from "@pp/api/dist/contracts";
import { QueryClient } from '@tanstack/react-query';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';

export const tsr = initTsrReactQuery(siteContract, {
  baseUrl: 'http://localhost:5005'
});

export const queryClient = new QueryClient();