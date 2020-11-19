export default interface Event {
  id: string;
  service: string;
  endpoint: string;
  status: string;
  createdOn?: Date;
  updatedOn?: Date;
  completedOn?: Date;
  message?: string;
}
