import axios, { AxiosResponse } from "axios";

import RequestParams from "../../types/RequestParams";
import Event from "../../types/Event";

export async function getEvents({
  apiUrl,
  auth,
}: RequestParams): Promise<Event[]> {
  const response: AxiosResponse = await axios.get("/backend/events", {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("getEvents - Events:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Events: ${JSON.stringify(response.data)}`);
}

export async function getEvent(
  { apiUrl, auth }: RequestParams,
  id: string
): Promise<Event> {
  const response: AxiosResponse = await axios.get(`/backend/events/${id}`, {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("getEvent - Event:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Event: ${JSON.stringify(response.data)}`);
}
