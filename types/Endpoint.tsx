export default interface Endpoint {
  id: string;
  endpoint: string;
  service: string;
  name: string;
  resultOnly: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  supportedMethods: string;
  published: boolean;
  createdOn?: Date;
  updatedOn?: Date;
}
