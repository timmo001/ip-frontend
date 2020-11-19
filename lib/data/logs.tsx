import axios, { AxiosResponse } from "axios";

import RequestParams from "../../types/RequestParams";
import Log from "../../types/Log";

export async function getLogs({ apiUrl, auth }: RequestParams): Promise<Log[]> {
  const response: AxiosResponse = await axios.get("/backend/logs", {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("getLogs - Logs:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Logs: ${JSON.stringify(response.data)}`);
}

export async function getLog(
  { apiUrl, auth }: RequestParams,
  id: string
): Promise<Log> {
  const response: AxiosResponse = await axios.get(`/backend/logs/${id}`, {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("getLog - Log:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Log: ${JSON.stringify(response.data)}`);
}
