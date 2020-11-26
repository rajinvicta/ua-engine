class DepNode {
  private _name:Symbol;
  private _master:DepNode | null;
  private _children:DepNode[];
  private _data:any;
  private _type:any;

  constructor(name:Symbol, master:DepNode | null = null) {
    this._name = name;
    this._master = master;

    this._children = [];
    this._data = null;
  }

  get children():DepNode[] {
    return this._children;
  }

  get master():DepNode {
    if(this._master == null) {
      console.error("master is still null, it doesn't exist. It is Root!");
      return new DepNode(Symbol('null'));
    } else {
      return this._master;
    }
  }

  get name():Symbol {
    return this._name;
  }

  get type():any {
    return this._type;
  }

  get data():any {
    return this._data;
  }

  get isAllocated():boolean {
    if (this._data != null) {
      return true;
    } else {
      return false;
    }
  }

  get isNoDep():boolean {
    if (this._children.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  get instances():any[] {
    let instanceList:any[] = [];

    for (let c = 0; c < this._children.length; c++) {
      let currentChild = this._children[c];
      instanceList.push(currentChild.data);
    }

    return instanceList;
  }

  get depsReady():boolean {
    let allReady:boolean = true;

    for (let c = 0; c < this._children.length; c++) {
      let currentChild = this._children[c];
      if(currentChild.data == null) allReady = false;
    }

    return allReady;
  }

  set master(mstr:DepNode) {
    this._master = mstr;
  }

  set type(typ:any) {
    this._type = typ;
  }

  set data(dat:any) {
    this._data = dat;
  }

  public addChild(chd:DepNode) {
    this._children.push(chd);
  }

  public importChildren(chdList:DepNode[]) {
    for (let c = 0; c < chdList.length; c++) {
      let currentNode = chdList[c];
      this.addChild(currentNode);
    }
  }
}

export default DepNode;