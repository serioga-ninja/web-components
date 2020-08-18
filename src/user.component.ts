import { Component, IComponent } from './decorators/component';
import { ComponentEvent } from './decorators/event';
import { UserService } from './user.service';
import { rand } from './utils';

@Component({
    name: 'user-component',
    template: `
    <h1>
        Hello <%= user.name %>
    </h1>`,
    require: [UserService]
})
export class UserComponent implements IComponent {

    user: any;

    constructor(userService: UserService) {
        this.user = userService.user;
    }

    @ComponentEvent('click')
    onClick() {
        console.log(this.user);
    }
}
