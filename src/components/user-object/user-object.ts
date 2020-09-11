import { Component, IComponent } from '../../logic/decorators/component';
import { ComponentEvent } from '../../logic/decorators/event';
import { rand } from '../../logic/utils';
import { IUser } from '../user/user.model';
import { UserService } from '../user/user.service';

@Component({
    name: 'user-object-component',
    template: `
    <h1>
        Hello <%= user.name %> 
    </h1>
    `,
    require: [UserService]
})
class UserObject implements IComponent {
    user: IUser;

    constructor(private userService: UserService) {
        this.user = this.userService.userObject;
    }

    async onInit(attrs: { id: string }) {
        this.user = await this.userService.loadUserObject(attrs.id);
    }

    @ComponentEvent('click')
    change() {
        this.user.name = rand(99994);
    }
}
