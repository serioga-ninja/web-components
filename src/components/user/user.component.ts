import { Component, IComponent } from '../../logic/decorators/component';
import { ComponentEvent } from '../../logic/decorators/event';
import { IUser, UserService } from './user.service';
import { rand } from '../../logic/utils';

@Component({
    name: 'user-component',
    template: `
    <h1>
        Hello <%= user.name %>
    </h1>`,
    require: [UserService]
})
export class UserComponent implements IComponent {

    user: IUser;

    constructor(private userService: UserService) {
        this.user = this.userService.user;
    }

    @ComponentEvent('click')
    onClick() {
        this.user.name = rand(2323);
        console.log(this.user);
    }

    async onInit() {
        this.user = await this.userService.loadUser();
    }
}
