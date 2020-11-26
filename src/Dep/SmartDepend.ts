import Dep from './Dep';
import DepResolver from './DepResolver';

class SmartDepend {
  private _modList:Dep[];

  constructor() {
    this._modList = [];
  }

  public addModule(type:any, single:boolean):Symbol {
    let modDep = this._createDep(type, single);

    this._modList.push(modDep);

    return modDep.name;
  }

  public addDependency(parent:Symbol, dependency:Symbol) {
    let parentDep = this._getDep(parent);
    let dependencyDep = this._getDep(dependency);

    if(parentDep != null && dependencyDep != null) {
      parentDep.depList.push(dependencyDep);
    } else {
      console.warn("Either %s or %s modules not found!", parent, dependency);
    }
  }

  public resolve(target:Symbol):any {
    return this._resolveDepends(target);
  }

  private _createDep(type:any, single:boolean):Dep {
    let d = new Dep(type, single);

    return d;
  }

  private _resolveDepends(target:Symbol):any {
    let resolver = new DepResolver(this._modList);

    return resolver.resolve(target);
  }

  //Foreign
  private _getDep(name:Symbol):Dep | null {
    let tempDep = new Dep(null, false);

    return tempDep.findDepByName(name, this._modList);
  }
}

export default SmartDepend;