import dependencies, { TClass } from '../dependencies';

export interface IInjectableOptions {
  require?: TClass[];
}

export const Injectable = (options: IInjectableOptions = {}) => {
  return (ComponentClass: TClass) => {
    dependencies.register(ComponentClass, true, options.require);
  }
}
