import { IWebComponent } from './decorators/component';

const wrapableObject = (obj: any): boolean => {
  return typeof obj === 'object' && !(obj instanceof EventTarget);
};

const objectProxyWrapper = (obj: object, changeCallback: (prev?: any, newValue?: any) => void) => {
  Object.keys(obj).forEach((key) => {
    if (wrapableObject(obj[key])) {
      obj[key] = objectProxyWrapper(obj[key], changeCallback);
    }
  });


  return new Proxy(obj, {
    set: (obj, prop, value) => {
      if (wrapableObject(value)) {
        value = objectProxyWrapper(value, changeCallback);
      }

      obj[prop] = value;
      changeCallback();

      return true;
    }
  });
};

const changeCallback = (element: IWebComponent) => {
  return () => {
    element.render();
  }
};

export const proxyFactory = (element: IWebComponent, ClassConstructor, watchAttributes?: string[]) => {
  return class extends ClassConstructor {
    constructor(...args: any[]) {
      super(...args);

      Object.keys(this).forEach((key) => {
        if (wrapableObject(this[key])) {
          this[key] = objectProxyWrapper(this[key], changeCallback(element));
        }
      });

      return new Proxy(this, {
        set: (obj, prop, value) => {
          console.log(`Property "${prop.toString()}" changed:`, obj[prop], value);


          if (wrapableObject(value)) {
            value = objectProxyWrapper(value, changeCallback(element));
          }

          // The default behavior to store the value
          obj[prop] = value;

          element.render();

          // Indicate success
          return true;
        }
      });
    }
  }
}
