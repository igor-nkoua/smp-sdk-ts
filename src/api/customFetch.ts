import { fetch as undiciFetch, RequestInfo, RequestInit, Response as UndiciResponse } from 'undici';
import { undiciAgent } from './httpsAgent.js';

export const customFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<UndiciResponse> => {
  const url = typeof input === 'string' ? input : input.toString();
  console.log("💡 Using undiciFetch with agent:", !!undiciAgent);

  return undiciFetch(url, {
    ...init,
    dispatcher: undiciAgent,
  });
};
