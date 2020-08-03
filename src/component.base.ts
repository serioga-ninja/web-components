import { Logger } from './logger';
import { prepareClass, rand } from './utils';

export interface IHtmlComponentOptions {
    name: string;
    template?: string;
    templateUrl?: string;
}

export interface IComponent {

}


interface IRegisterItem {
    component: HTMLElement;
    relatedClass: IComponent;
    events
}

class Register {

    private static _instance: Register;

    public static get instance() {
        return Register._instance || (Register._instance = new Register());
    }

    private items: { [key: string]: IRegisterItem };

    constructor() {
        this.items = {};
    }

    registerEvent(target, eventName: string) {
        const item = this.items[target['_id']] || (this.items[target['_id']] = target);
    }
}

export function ComponentEvent(eventName: string) {

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        prepareClass(target);

        Register.instance.registerEvent(target, eventName);
    }
}

export const Component = (options: IHtmlComponentOptions) => {
    return (ComponentClass) => {
        prepareClass(ComponentClass);

        customElements.define(options.name, class extends HTMLElement {
            static get observedAttributes() {
                return [];
            }

            protected logger: Logger;

            constructor() {
                super();

                this.logger = Logger.instance;
                this.attachShadow({ mode: 'open' });
            }

            /**
             * Called when an observed attribute has been added, removed, updated, or replaced. Also called for initial values
             * when an element is created by the parser, or upgraded. Note: only attributes listed in the observedAttributes
             * property will receive this callback.
             */
            attributeChangedCallback(attrName: string, oldValue: string, newValue: string) {
                this.logger.log(attrName, oldValue, newValue);

                if (oldValue !== newValue) {
                    this[attrName] = this.hasAttribute(attrName);
                }
            }

            /**
             * Called every time the element is inserted into the DOM. Useful for running setup code, such as fetching
             * resources or rendering. Generally, you should try to delay work until this time.
             */
            connectedCallback() {
                this.render();
            }

            /**
             * Called every time the element is removed from the DOM. Useful for running clean up code.
             */
            disconnectedCallback() {
            }

            /**
             * The custom element has been moved into a new document (e.g. someone called document.adoptNode(el)).
             */
            adoptedCallback() {

            }

            render() {
                const { shadowRoot } = this;

                shadowRoot.innerHTML = options.template;
            }
        });
    };
};
