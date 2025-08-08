import { UserRoles } from '../interfaces';

export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
}
