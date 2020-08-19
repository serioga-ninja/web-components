import { IComponent } from './decorators/component';
import { rand } from './utils';

export type TComponent = new (...args: any[]) => IComponent;

interface IRegisterItem {
    component: HTMLElement;
    relatedClass: IComponent;
    events
}

interface IRegisterEvent {
    component: TComponent;
    eventName: string;
    callback: (el?: HTMLElement, ev?: Event) => void;
}

export class Register {

    private static _instance: Register;

    public static get instance() {
        return Register._instance || (Register._instance = new Register());
    }

    private items: { [key: string]: IRegisterItem };
    private events: IRegisterEvent[];

    constructor() {
        this.items = {};
        this.events = [];
    }

    getEvents(id: string) {
        return this.events.filter((row) => row.component['_id'] === id);
    }

    registerEvent(ComponentClass: TComponent, callback: (el?: HTMLElement) => void, eventName: string) {

        this.events.push({
            component: ComponentClass,
            callback,
            eventName
        });
    }

    registerComponent(htmlElment: HTMLElement, target: IComponent) {
        const id = `${new Date().getTime()}-${rand(1000)}`;
    }
}
