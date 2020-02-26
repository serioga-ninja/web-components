import { Logger } from './logger';

export interface IHtmlComponentOptions {
    name: string;
    template?: string;
    templateUrl?: string;
}

export const Component = (options: IHtmlComponentOptions) => {
    return (Component) => {

        function MyCustomElement() {
            return Reflect.construct(HTMLComponentBase, [], MyCustomElement);
        }

        MyCustomElement.prototype.__proto__ = HTMLComponentBase.prototype;
        MyCustomElement.__proto__ = HTMLComponentBase;
        MyCustomElement.prototype.relatedClass = Component;
        MyCustomElement.prototype.options = options;

        customElements.define(options.name, MyCustomElement as any);
    };
};

export class HTMLComponentBase extends HTMLElement {

    static get observedAttributes() {
        return [];
    }

    logger: Logger;
    options: IHtmlComponentOptions;
    relatedClass: any;

    constructor() {
        super();

        this.logger = new Logger();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * This is lifecycle method is called whenever one of the element constructor’s observedAttributes are updated
     */
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string) {
        this.logger.log(attrName, oldValue, newValue);
        if (oldValue !== newValue) {
            this[attrName] = this.hasAttribute(attrName);
        }
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
    }

    render() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = this.options.template;
    }
}
