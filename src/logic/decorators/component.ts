import * as ejs from 'ejs';
import dependencies, { TClass } from '../dependencies';
import { Logger } from '../logger';
import { Register, TComponent } from '../register';
import { prepareClass } from '../utils';
import { proxyFactory } from '../watch-factory';

export interface IHtmlComponentOptions {
    name: string;
    template?: string;
    templateUrl?: string;
    require?: TClass[];
}

export interface IComponent {
    onInit?(): void;
    onDestroy?(): void;
    afterRender?(): void;
    beforeRender?(): void;
}

export interface IWebComponent extends HTMLElement {
    render(): void;
}


export const Component = (options: IHtmlComponentOptions) => {
    return (ComponentClass: TComponent) => {
        prepareClass(ComponentClass);

        dependencies.register(ComponentClass, false, options.require);

        customElements.define(options.name, class extends HTMLElement implements IWebComponent {
            static get observedAttributes() {
                return [];
            }

            protected componentInstance: IComponent;
            protected ready: boolean;
            protected logger: Logger;

            constructor() {
                super();

                this.logger = Logger.instance;
                this.attachShadow({ mode: 'open' });

                this.createInstance();

                Register.instance.registerComponent(this, this.componentInstance);

                this.registerEvents();
                this.ready = true;
            }

            private createInstance() {
                const Constructor = proxyFactory(this, ComponentClass);

                this.componentInstance = new Constructor(...dependencies.getInstances(options.require));
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
                if (typeof this.componentInstance.onInit === 'function') {
                    this.componentInstance.onInit();
                }

                this.render();
            }

            /**
             * Called every time the element is removed from the DOM. Useful for running clean up code.
             */
            disconnectedCallback() {
                if (typeof this.componentInstance.onDestroy === 'function') {
                    this.componentInstance.onDestroy();
                }
            }

            /**
             * The custom element has been moved into a new document (e.g. someone called document.adoptNode(el)).
             */
            adoptedCallback() {
            }

            render() {
                const { shadowRoot } = this;

                if (typeof this.componentInstance.beforeRender === 'function') {
                    this.componentInstance.beforeRender();
                }

                shadowRoot.innerHTML = ejs.render(options.template, this.componentInstance);

                if (typeof this.componentInstance.afterRender === 'function') {
                    this.componentInstance.afterRender();
                }
            }
        });
    };
};
