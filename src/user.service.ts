import { Injectable } from './decorators/injectable';
import { rand } from './utils';

export interface IUser {
    name: string | number;
}

@Injectable()
export class UserService {

    user: IUser;

    constructor() {
        this.user = { name: rand(10000) };
    }
}
