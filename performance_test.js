class TypeA {
  constructor() {
  }
}

class TypeB {
  constructor() {
  }
}

class TypeC {
  constructor() {
  }
}

class MyType {
  constructor(a, b, c) {
    this._a = a;
    this._b = b;
    this._c = c;
  }
}

function createObject(Type, arr) {
  if (arr.length == 4) return new Type(arr[1], arr[2], arr[3]);
}

for (var j = 0; j < 20; j++) {
  console.time('dynamically apply-ing');
  for (var i = 0; i < 1000000; i++) {
    let a = [null];
    a.push(new TypeA());
    a.push(new TypeB());
    a.push(new TypeC());

    let myTypeObj = new (Function.prototype.bind.apply(MyType, a));
  }

  console.timeEnd('dynamically apply-ing');

  console.time('hard-coded calling');
  for (var i = 0; i < 1000000; i++) {
    let a = [null];
    a.push(new TypeA());
    a.push(new TypeB());
    a.push(new TypeC());

    let myTypeObj = createObject(MyType, a);
  }
  console.timeEnd('hard-coded calling');
}