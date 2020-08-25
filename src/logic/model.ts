export interface IDictionary {
    [key: string]: string | number | null | IDictionary | undefined;
}

export type TAnyOf<T> = {
    [key in keyof T]?: T[key];
}

type TListenerCallback<T extends IDictionary> = (model?: Model<T>) => void;

type TEvent =
    | 'change'
    ;

class ModelEvent {
    private eventName: TEvent;
    private callback: any;
    private options: any;

    constructor(eventName: TEvent, callback: any, options: any) {
        this.options = options;
        this.callback = callback;
        this.eventName = eventName;
    }
}

class ChangeEvent extends ModelEvent {
    constructor(callback: any, options: any) {
        super('change', callback, options);
    }
}

type TEvents =
    | ChangeEvent
    ;

export class Model<T extends IDictionary> extends EventTarget {

    private events: TEvents[];

    protected attributes: T;

    constructor(attributes: T) {
        super();

        this.events = [];
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
    }

    private changed<TKey extends keyof T>(key: TKey, oldValue: T[TKey], newValue: T[TKey]) {

    }

    /**
     * Add event listeners to the model
     * @example build in events
     *
     * model.on({
     *     'change:id'() {
     *         // do some stuff when id changes
     *     },
     *     'change:name change:description'() {
     *         // do some stuff when name OR description changes
     *     }
     * })
     *
     * @param listeners
     */
    on(listeners: { [key: string]: TListenerCallback<T> }) {
        this.events.push(
            ...Object
                .keys(listeners)
                .reduce((res, listenersKey: string) => {
                    const events = listenersKey
                        .match(/([\w+:]+)/g)
                        .filter((res) => typeof res === 'string' && res.length > 0);

                    res.push(
                        ...events
                            .reduce((eRes, eKey) => {
                                const [eventName, param] = eKey.split(':');

                                switch (eventName as TEvent) {
                                    case 'change':
                                        eRes.push(new ChangeEvent(listeners[listenersKey], param));
                                        break;
                                }

                                return eRes;
                            }, [] as TEvents[])
                    )

                    return res;
                }, [] as TEvents[])
        )
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
