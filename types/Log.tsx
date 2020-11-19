export default interface Log {
  id: string;
  text: string;
  level: string;
  type: string;
  createdOn?: Date;
}
