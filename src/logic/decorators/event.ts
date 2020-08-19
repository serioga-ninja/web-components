import { Register } from '../register';
import { prepareClass } from '../utils';

export function ComponentEvent(eventName: string) {

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        prepareClass(target);

        Register.instance.registerEvent(target, descriptor.value, eventName);
    }
}
