import { Component, ComponentEvent, IComponent } from './component.base';

@Component({
    name: 'user-component',
    template: `<h1>Hello world</h1>`
})
export class UserComponent implements IComponent {

}

@Component({
    name: 'group-component',
    template: `<h1>Hello world</h1>`
})
export class GroupComponent implements IComponent {

    @ComponentEvent('click')
    onClick(ev) {
        console.log(ev);
    }
}
