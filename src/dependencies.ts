export type TClass = new (...args: any[]) => any;

interface IDependenceRow {
  Class: new (...args: any[]) => any;
  injectable: boolean;
  require?: TClass[];
  instance?: any;
}

const register: IDependenceRow[] = [];

class Dependencies {

  register(Class: TClass, injectable: boolean, require: TClass[] = []) {
    register.push({
      Class,
      injectable,
      require
    })
  }

  getInstances(require?: TClass[]): any[] {
    return (require || []).map((Class) => {
      return this.requireInstance(
        register.find((row) => row.Class.name === Class.name)
      );
    })
  }

  requireInstance(row: IDependenceRow) {
    if (!row.injectable) {
      console.error('Module is not injectable');

      return null;
    }

    return row.instance || (row.instance = new row.Class(...this.getInstances(row.require)));
  }
}

const dependencies = new Dependencies();

export default dependencies;
