import ApiAuthorization from "./ApiAuthorization";

export default interface RequestParams {
  apiUrl: string;
  auth: ApiAuthorization;
}
