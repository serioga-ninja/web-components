import { Component, IComponent } from '../../logic/decorators/component';
import { ComponentEvent } from '../../logic/decorators/event';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { rand } from '../../logic/utils';

@Component({
    name: 'user-component',
    template: `
    <h1>
        Hello <%= user.get('name') %> 
    </h1>
    <input name="name" onchange="<%= onChange() %>"/>`,
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

@Component({
    name: 'text-component',
    template: `<span><%=text%></span>`,
    attributes: ['text']
})
export class TestComponent implements IComponent {

    text: string;

    constructor() {
        this.text = '';
    }

    onInit({ text }) {
        this.text = text;
    }
}


