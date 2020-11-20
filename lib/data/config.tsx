import axios, { AxiosResponse } from "axios";

import Config from "../../types/Config";
import RequestParams from "../../types/RequestParams";

export async function getConfig({
  apiUrl,
  auth,
}: RequestParams): Promise<Config> {
  const response: AxiosResponse = await axios.get("/backend/config", {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Config:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Config: ${JSON.stringify(response.data)}`);
}

export async function updateConfig(
  { apiUrl, auth }: RequestParams,
  config: Config
): Promise<Config> {
  const response: AxiosResponse = await axios.put(`/backend/config`, config, {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Config:", response.data);
    return config;
  }
  throw new Error(`Error updating Config: ${JSON.stringify(response.data)}`);
}
