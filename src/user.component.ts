import { Component, ComponentEvent, IComponent } from './component.base';
import { rand } from './utils';

@Component({
    name: 'user-component',
    template: `
    <h1>
        Hello <%= user.name %>
    </h1>`
})
export class UserComponent implements IComponent {

    user: any;

    constructor() {
        this.user = { name: rand(10000) }
    }

    @ComponentEvent('click')
    onClick() {
        console.log(this.user);
    }
}
