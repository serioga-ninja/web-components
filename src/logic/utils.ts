export const rand = (max: number) => Math.floor(Math.random() * max + 1);

export const prepareClass = (ComponentClass) => {
    const proto = typeof ComponentClass === 'function' ? ComponentClass.prototype : ComponentClass;
    proto['_id'] || (proto['_id'] = `${new Date().getTime()}-${rand(1000)}`);
};
