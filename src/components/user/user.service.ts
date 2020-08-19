import { Injectable } from '../../logic/decorators/injectable';
import { rand } from '../../logic/utils';

export interface IUser {
    name: string | number;
}

@Injectable()
export class UserService {

    user: IUser;

    constructor() {
        this.user = {} as IUser;
    }


    loadUser(): Promise<IUser> {
        return new Promise<IUser>((resolve) => {
            setTimeout(() => {
                this.user = { name: rand(10000) };

                resolve(this.user);
            }, 1000);
        })
    }
}
