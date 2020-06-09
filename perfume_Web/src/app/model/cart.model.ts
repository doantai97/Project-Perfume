import { User } from "./user";
import { Version } from "./version.model";

export class Cart {
  id?: number;
  quantity?: number;
  user?: User;
  version?: Version;
}
