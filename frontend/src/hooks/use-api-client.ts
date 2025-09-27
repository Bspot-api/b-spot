import { client } from "@/api/hooks/client.gen";
import { useEffect, useRef } from "react";

export function useApiClient() {
  const configSet = useRef(false);

  useEffect(() => {
    if (!configSet.current) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      client.setConfig({
        baseUrl: baseUrl
      });
      configSet.current = true;
      console.log('API client configured with baseUrl:', baseUrl);
    }
  }, []);

  return client;
}
