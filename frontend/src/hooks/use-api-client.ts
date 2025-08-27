import { client } from "@/api/hooks/client.gen";
import { useEffect, useRef } from "react";

export function useApiClient() {
  const configSet = useRef(false);

  useEffect(() => {
    if (!configSet.current) {
      client.setConfig({
        baseUrl: 'http://localhost:3001'
      });
      configSet.current = true;
      console.log('API client configured with baseUrl:', 'http://localhost:3001');
    }
  }, []);

  return client;
}
