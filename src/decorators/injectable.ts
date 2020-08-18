import dependencies from '../dependencies';

export interface IInjectableOptions {
    name?: string;
    require?: string[];
}

export const Injectable = (options: IInjectableOptions = {}) => {
    return (ComponentClass: any) => {
        const name = options.name || ComponentClass.name;

        dependencies.register(name, ComponentClass, true, options.require);
    }
}
