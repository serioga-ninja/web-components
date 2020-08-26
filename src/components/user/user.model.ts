import { Model } from '../../logic/model';


export interface IUser {
    name: string | number;
    id: string | number;
}

export class UserModel extends Model<IUser> {

}
