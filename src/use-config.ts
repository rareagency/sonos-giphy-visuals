import { useEffect, useState } from "react";

type Config = {
  giphy_api_key: string;
};

export function useConfig() {
  const [config, setConfig] = useState<null | Config>(null);

  useEffect(() => {
    async function fetchConfig() {
      const res = await fetch("/config.json");
      const data = await res.json();
      setConfig(data);
    }
    fetchConfig();
  }, []);

  return config;
}
