import { Injectable } from '../../logic/decorators/injectable';
import { rand } from '../../logic/utils';
import { UserModel } from './user.model';


@Injectable()
export class UserService {

    user: UserModel;

    constructor() {
        this.user = new UserModel();
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
