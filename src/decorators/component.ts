import * as ejs from 'ejs';
import dependencies, { TClass } from '../dependencies';
import { Logger } from '../logger';
import { Model } from '../model';
import { Register, TComponent } from '../register';
import { prepareClass, rand } from '../utils';

export interface IHtmlComponentOptions {
  styles?: any;
  name: string;
  template?: string;
  templateUrl?: string;
  require?: TClass[];
  attributes?: string[];
}

export interface IComponent {
  el?: IWebComponent;
  onInit?(attrs?: { [key: string]: any; }): void;
  onDestroy?(): void;
  afterRender?(): void;
  beforeRender?(): void;
  onAttributesChange?(oldValue?: string, newValue?: string): void;
}

export interface IWebComponent extends HTMLElement {
  render(): void;
}


export const Component = (options: IHtmlComponentOptions) => {
  return (ComponentClass: TComponent) => {
    prepareClass(ComponentClass);

    dependencies.register(ComponentClass, false, options.require);

    customElements.define(options.name, class extends HTMLElement implements IWebComponent {
      protected componentInstance: IComponent;
      protected ready: boolean;
      protected logger: Logger;
      protected _id: string;

      constructor() {
        super();

        this.logger = Logger.instance;
        this.attachShadow({ mode: 'open' });

        this.createInstance();

        Register.instance.registerComponent(this, this.componentInstance);

        this.ready = true;
        this._id = rand(100000).toString();
        this.registerEvents();
      }

      static get observedAttributes() {
        return options.attributes;
      }

      /**
       * Called when an observed attribute has been added, removed, updated, or replaced. Also called for initial values
       * when an element is created by the parser, or upgraded. Note: only attributes listed in the observedAttributes
       * property will receive this callback.
       */
      attributeChangedCallback(attrName: string, oldValue: string, newValue: string) {
        this.logger.log(attrName, oldValue, newValue);

        if (typeof this.componentInstance.onAttributesChange === 'function') {
          this.componentInstance.onAttributesChange(oldValue, newValue);
        }
      }

      /**
       * Called every time the element is inserted into the DOM. Useful for running setup code, such as fetching
       * resources or rendering. Generally, you should try to delay work until this time.
       */
      connectedCallback() {
        if (typeof this.componentInstance.onInit === 'function') {
          const attrs = {};
          for (const key of this.getAttributeNames()) {
            attrs[key] = this.getAttribute(key);
          }

          this.componentInstance.onInit(attrs);
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

        if (options.template) {
          shadowRoot.innerHTML = ejs.render(options.template, this.componentInstance);
        }

        if (typeof this.componentInstance.afterRender === 'function') {
          this.componentInstance.afterRender();
        }
      }

      private createInstance() {
        this.componentInstance = new ComponentClass(...dependencies.getInstances(options.require));
        this.componentInstance.el = this;
      }

      private registerEvents() {
        const events = Register.instance.getEvents(this.componentInstance['_id']);
        for (const row of events) {
          this.addEventListener(row.eventName, (ev) => {
            row.callback.call(this.componentInstance, this, ev);
          });
        }

        for (const key of Object.keys(this.componentInstance)) {
          if (this.componentInstance[key] instanceof Model) {
            (this.componentInstance[key] as Model<any>).on('change', () => this.render());
          }
        }
      }
    });
  };
};
