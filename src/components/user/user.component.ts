import { Component, IComponent } from '../../logic/decorators/component';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@Component({
    name: 'user-component',
    template: `
    <h1>
        Hello <%= user.get('name') %> 
    </h1>
    `,
    require: [UserService]
})
export class UserComponent implements IComponent {

    user: UserModel;

    constructor(private userService: UserService) {
        this.user = this.userService.user;
        this.user.on('change', () => {
            this.el.render();
        });
    }

    async onInit(attrs: { id: string }) {
        console.log(attrs);
        this.user = await this.userService.loadUser(attrs.id);
    }

    onChange() {
        console.log('onchange');
    }
}


