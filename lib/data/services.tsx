import axios, { AxiosResponse } from "axios";

import RequestParams from "../../types/RequestParams";
import Service from "../../types/Service";

export async function getServices({
  apiUrl,
  auth,
}: RequestParams): Promise<Service[]> {
  console.log("getServices - auth:", auth);
  const response: AxiosResponse = await axios.get("/backend/services", {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Services:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Services: ${JSON.stringify(response.data)}`);
}

export async function getService(
  { apiUrl, auth }: RequestParams,
  id: string
): Promise<Service> {
  console.log("getServices - auth:", auth);
  const response: AxiosResponse = await axios.get(`/backend/services/${id}`, {
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Service:", response.data);
    return response.data;
  }
  throw new Error(`Error getting Services: ${JSON.stringify(response.data)}`);
}

export async function deleteService(
  { apiUrl, auth }: RequestParams,
  service: Service
): Promise<void> {
  const response: AxiosResponse = await axios.delete(
    `/backend/services/${service.id}`,
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Deleted:", service);
    return;
  }
  throw new Error(`Error deleting Service: ${JSON.stringify(response.data)}`);
}

export async function createService(
  { apiUrl, auth }: RequestParams,
  service: Service
): Promise<Service> {
  const response: AxiosResponse = await axios.post(
    `/backend/services`,
    service,
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  if (response.status === 201 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Create Service Result:", response.data);
    service.id = response.data.id;
    return service;
  }
  throw new Error(`Error creating Service: ${JSON.stringify(response.data)}`);
}

export async function updateService(
  { apiUrl, auth }: RequestParams,
  service: Service
): Promise<Service> {
  const response: AxiosResponse = await axios.put(
    `/backend/services/${service.id}`,
    service,
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  if (response.status === 200 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Update Service Result:", response.data);
    return service;
  }
  throw new Error(`Error updating Service: ${JSON.stringify(response.data)}`);
}

export async function triggerService(
  { apiUrl, auth }: RequestParams,
  service: Service
): Promise<void> {
  const response: AxiosResponse = await axios.post(
    `/backend/events/${service.id}/trigger`,
    undefined,
    {
      baseURL: apiUrl,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );
  if (response.status === 201 && response.data) {
    if (process.env.NODE_ENV === "development")
      console.log("Trigger Service Result:", response.data);
    return;
  }
  throw new Error(`Error triggering Event: ${JSON.stringify(response.data)}`);
}
