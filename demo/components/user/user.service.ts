import { Injectable } from '../../../src/decorators/injectable';
import { rand } from '../../../src/utils';
import { IUser, UserModel } from './user.model';


@Injectable()
export class UserService {

  user: UserModel;
  userObject: IUser;

  constructor() {
    this.user = new UserModel();
    this.userObject = {} as IUser;
  }

  loadUserObject(id: string): Promise<IUser> {
    return new Promise<IUser>((resolve) => {
      setTimeout(() => {
        this.userObject = {
          name: rand(10000),
          id
        };

        resolve(this.userObject);
      }, 1000);
    })
  }

  loadUser(id: string): Promise<UserModel> {
    return new Promise<UserModel>((resolve) => {
      setTimeout(() => {
        this.user.set({
          name: rand(10000),
          id
        })

        resolve(this.user);
      }, 1000);
    })
  }
}
