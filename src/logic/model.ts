export interface IDictionary {
    [key: string]: any;
}

export type TAnyOf<T> = {
    [key in keyof T]?: T[key];
}

type TEventName =
    | 'change'
    ;

interface IEventRow {
    eventName: TEventName;
    callbacks: any[];
}

class EventsCollection {
    private events: IEventRow[] = [];

    get(eventName: TEventName): IEventRow | null {
        return this.events
            .find((event) => event.eventName === eventName);
    }

    add(eventName: TEventName, callback: any) {
        const eventRow = this.get(eventName);
        if (eventRow) {
            eventRow.callbacks.push(callback);

            return;
        }

        this.events.push({
            eventName,
            callbacks: [callback]
        });
    }

    getCallbacks(eventName: TEventName): any[] {
        return (this.get(eventName) || {}).callbacks || [];
    }
}

export class Model<T extends IDictionary> extends EventTarget {

    private events: EventsCollection;

    protected attributes: T;

    constructor(attributes: T = {} as T) {
        super();

        this.events = new EventsCollection();
        this.attributes = new Proxy(attributes, {
            set: (obj, prop: keyof T, value) => {
                const oldValue = obj[prop];

                // The default behavior to store the value
                obj[prop] = value;

                this.changed(prop, oldValue, value);

                // Indicate success
                return true;
            }
        });

        Object.defineProperty(this, 'handleEvent', {
            writeable: false,
            value: (event: CustomEvent) => {
                switch (event.type as TEventName) {
                    case 'change':
                        for (const callback of this.events.getCallbacks('change')) {
                            callback(event.detail, event);
                        }
                        break;
                }
            }
        } as PropertyDescriptor);
    }

    private changed<TKey extends keyof T>(key: TKey, oldValue: T[TKey], newValue: T[TKey]) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                key,
                oldValue,
                newValue
            }
        }))
    }

    /**
     * Add event listeners to the model
     */
    on(eventName: TEventName, callback: any) {
        if (!this.events.get(eventName)) {
            this.addEventListener(eventName, this as any, false);
        }

        this.events.add(eventName, callback);
    }

    /**
     * Set the attributes of the model
     * @param attributes
     */
    set(attributes: TAnyOf<T>): this {
        Object.assign(this.attributes, attributes);

        return this;
    }


    /**
     * Retrieve the value of attribute or values as an object if array of keys passed
     * @param key
     */
    get<TKey extends keyof T>(key: TKey): T[TKey];
    get<TKey extends keyof T>(key: TKey[]): { [key in TKey]: T[key] };
    get<TKey extends keyof T>(key: TKey | TKey[]): T[TKey] | { [key in TKey]: T[key] } {
        if (key instanceof Array) {
            return key.reduce((res, key) => {
                res[key] = this.attributes[key];

                return res;
            }, {} as { [key in TKey]: T[key] });
        }

        return this.attributes[key];
    }
}
