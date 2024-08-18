export type UserDTO = {
  DisplayName: string;
  Email: string;
  Permissions: { [key: string]: boolean };
  UserId: number;
  Username: string;
};
