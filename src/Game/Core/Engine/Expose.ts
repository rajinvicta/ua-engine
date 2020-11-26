class Expose {
  constructor() {

  }

  init() {
    (<any>window).UAE = {
      "default": {}
    };
   // (<any>window).UAE = (<any> window).UAE_1['default'];
  }

  add(key: string, object: any) {
    (<any>window).UAE["default"][key] = object;
  }
}

export default Expose;