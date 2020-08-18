import * as ejs from 'ejs';
import dependencies, { TClass } from '../dependencies';
import { Logger } from '../logger';
import { Register, TComponent } from '../register';
import { prepareClass } from '../utils';

export interface IHtmlComponentOptions {
    name: string;
    template?: string;
    templateUrl?: string;
    require?: TClass[];
}

export interface IComponent {

}

export const Component = (options: IHtmlComponentOptions) => {
    return (ComponentClass: TComponent) => {
        prepareClass(ComponentClass);
        dependencies.register(ComponentClass, false, options.require);

        customElements.define(options.name, class extends HTMLElement {
            static get observedAttributes() {
                return [];
            }

            protected componentInstance: IComponent;
            protected logger: Logger;

            constructor() {
                super();

                this.logger = Logger.instance;
                this.attachShadow({ mode: 'open' });


                this.componentInstance = new ComponentClass(...dependencies.getInstances(options.require));

                Register.instance.registerComponent(this, this.componentInstance);
                this.registerEvents();
            }

            private registerEvents() {
                const events = Register.instance.getEvents(this.componentInstance['_id']);
                for (const row of events) {
                    this.addEventListener(row.eventName, (ev) => {
                        row.callback.call(this.componentInstance, this, ev);
                    });
                }
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

                shadowRoot.innerHTML = ejs.render(options.template, this.componentInstance);
            }
        });
    };
};
