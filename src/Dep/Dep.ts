class Dep {
  private _name:Symbol;
  private _type:any;
  private _singleton:boolean;
  private _obj:any;

  public depList:Dep[];

  constructor(type:any, isSingleton:boolean = false) {
    this._name = Symbol();
    this._type = type;
    this._singleton = isSingleton;
    this._obj = null;


    this.depList = [];
  }

  get name():Symbol {
    return this._name;
  }

  get type():any {
    return this._type;
  }

  get singleton():boolean {
    return this._singleton;
  }

  get obj():any {
    return this._obj;
  }

  get totalDep():number {
    return this.depList.length;
  }

  set obj(o:any) {
    this._obj = o;
  }

  findDepByName(name:Symbol, list:Dep[]):Dep |null {
    for (let c = 0; c < list.length; c++) {
      let mod = list[c];
      let modName = mod.name;

      if(modName == name) return mod;
    }

    return null;
  }

}

export default Dep;