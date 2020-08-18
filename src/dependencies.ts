interface IDependenceRow {
    name: string;
    Class: new (...args: any[]) => any;
    injectable: boolean;
    require?: string[];
    instance?: any;
}

const register: IDependenceRow[] = [];

class Dependencies {

    register(name: string, Class: new (...args: any) => any, injectable: boolean, require: string[] = []) {
        register.push({
            name,
            Class,
            injectable,
            require
        })
    }

    getInstances(require?: string[]): any[] {
        return (require || []).map((name) => {
            return this.requireInstance(
                register.find((row) => row.name === name)
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
