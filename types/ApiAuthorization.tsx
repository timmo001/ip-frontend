export default interface ApiAuthorization {
  username: string;
  expiresIn: string
  expiry: Date;
  accessToken: string;
}
