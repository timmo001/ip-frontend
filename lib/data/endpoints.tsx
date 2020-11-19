import axios, { AxiosResponse } from "axios";

import RequestParams from "../../types/RequestParams";
import Endpoint from "../../types/Endpoint";

export async function getEndpoints({
  apiUrl,
  auth,
}: RequestParams): Promise<Endpoint[]> {
  const response: AxiosResponse = await axios.get("/backend/endpoints", {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("getEndpoints - Endpoints:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Endpoints: ${JSON.stringify(response.data)}`);
}

export async function getEndpoint(
  { apiUrl, auth }: RequestParams,
  id: string
): Promise<Endpoint> {
  const response: AxiosResponse = await axios.get(`/backend/endpoints/${id}`, {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("getEndpoint - Endpoint:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Endpoint: ${JSON.stringify(response.data)}`);
}

export async function deleteEndpoint(
  { apiUrl, auth }: RequestParams,
  endpoint: Endpoint
): Promise<void> {
  const response: AxiosResponse = await axios.delete(
    `/backend/endpoints/${endpoint.id}`,
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  if (response.status === 200) {
    if (process.env.NODE_ENV === "development")
      console.log("Deleted:", endpoint);
    return;
  }
  throw new Error(`Error deleting Endpoint: ${JSON.stringify(response.data)}`);
}

export async function createEndpoint(
  { apiUrl, auth }: RequestParams,
  endpoint: Endpoint
): Promise<Endpoint> {
  const response: AxiosResponse = await axios.post(
    `/backend/endpoints`,
    endpoint,
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  console.log(response);
  if (response.status === 201 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Endpoints:", response.data);
    endpoint.id = response.data.id;
    return endpoint;
  }
  throw new Error(`Error creating Endpoint: ${JSON.stringify(response.data)}`);
}

export async function updateEndpoint(
  { apiUrl, auth }: RequestParams,
  endpoint: Endpoint
): Promise<Endpoint> {
  const response: AxiosResponse = await axios.put(
    `/backend/endpoints/${endpoint.id}`,
    endpoint,
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Endpoints:", response.data);
    return endpoint;
  }
  throw new Error(`Error updating Endpoint: ${JSON.stringify(response.data)}`);
}

export async function triggerEndpoint(
  { apiUrl, auth }: RequestParams,
  endpoint: Endpoint
): Promise<void> {
  const response: AxiosResponse = await axios.post(
    `/backend/events`,
    { type: "endpoint", endpointKey: endpoint.id },
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  if (response.status === 201 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Endpoints:", response.data);
  }
  throw new Error(`Error triggering Event: ${JSON.stringify(response.data)}`);
}
