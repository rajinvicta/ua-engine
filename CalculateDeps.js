const path = require("path")
const fs = require("fs")
const _ = require("lodash");
const strip_comments = require('strip-comments');



class CalculateDeps {
  constructor() {
    this._files = [];
    this._modules = [];

    this._singles = [];
    this._ignores = [];
    
  }



  refreshDeps(sources, dest, singles, ignores) {
    this._singles = singles;
    this._ignores = ignores;

    this._loadModules(this._getAllFiles(sources));
    this._analyseModules();
    this._emit(dest);
    return true;
  }

  _emit(dest) {
    let textToPrint = String(fs.readFileSync('container.template'));
    let imports = this._getImports();
    let declares = this._getDeclares();
    let addModules = this._getAddModules();
    let addDependsAll = this._getAddDepends();

    textToPrint = textToPrint.replace('TEMP_IMPORT_LIST_ALL', imports);
    textToPrint = textToPrint.replace('TEMP_DECLARATIONS', declares);
    textToPrint = textToPrint.replace('TEMP_ADDMODULES', addModules);
    textToPrint = textToPrint.replace('TEMP_ADDDEPENDS', addDependsAll);

    fs.writeFileSync(dest, textToPrint, 'utf8');
  }

  _getImports() {
    let importstatement = '';

    for (let c = 0; c < this._modules.length; c++) {
      let mod = this._modules[c];

      if (mod.name != null) {
        let path2 = mod.path.replace('.ts', '');
        let path3 = "../../" + path2.substr(path2.indexOf('src'), path2.length);
        path3 = path3.replace(/\\/g, "/");

        //console.log(path3);

        importstatement += "import " + mod.name + " from '" + path3 + "';\n";
      }
    }

    return importstatement;
  }

  _getDeclares() {
    let declares = '';

    for (let c = 0; c < this._modules.length; c++) {
      let mod = this._modules[c];

      if (mod.name != null) {
        declares += 'private _' + mod.name + ": any;\n";
      }
    }

    return declares;
  }

  _getAddModules() {
    let moduleList = '';

    for (let c = 0; c < this._modules.length; c++) {
      let mod = this._modules[c];

      if (mod.name != null) {
        moduleList += "this._" + mod.name + " = this._smartDepend.addModule(" + mod.name + ", " + String(mod.isSingle) + ");\n";
      }
    }

    return moduleList;
  }

  _getAddDepends() {
    let dependsList = '';

    for (let c = 0; c < this._modules.length; c++) {
      let mod = this._modules[c];

      if (mod.name != null && mod.deps.length > 0) {

        

        for (let d = 0; d < mod.deps.length; d++) {
          dependsList += 'this._smartDepend.addDependency(this._' + mod.name + ", this._" + mod.deps[d] + ");\n";
        }

        dependsList += "\n\n";
      }
    }

    return dependsList;
  }

  _analyseModules() {
    for (let c = 0; c < this._modules.length; c++) {
      let mod = this._modules[c];
      this._readModule(mod);
    }
  }

  _loadModules(files) {
    for (let c = 0; c < files.length; c++) {
      let mod = this._createModule(files[c]);

      this._modules.push(mod);
    }
  }

  _readModule(mod) {
    let path2 = mod.path;
    let textToPrint = strip_comments(String(fs.readFileSync(path2)));

    let isClass = textToPrint.indexOf('class') > -1;

    if (isClass) {
      let relevantArea = textToPrint.substr(textToPrint.indexOf('class'), 5000);
      let relevantArea2 = textToPrint.substr(textToPrint.indexOf('constructor'), 5000);
      
      let depArea = relevantArea2.substr(relevantArea2.indexOf('('), 5000);

      depArea = depArea.split(")")[0] + ")";

      let mainTokens = relevantArea.split(' ');
      let name = mainTokens[1];

      if (!this._isIgnore(name)) {
        let isSingle = this._isSingleton(name);
        depArea = depArea.substr(1, depArea.length-2);

        depArea = depArea.replace(/(?:\r\n|\r|\n)/g, '');

        let depList = this._createDeps(depArea);

        if (depList[0] != '') {
          mod.name = name;
          mod.deps = depList;
          mod.isSingle = isSingle;
        } else {
          mod.name = name;
          mod.isSingle = isSingle;
        }
        
      }

      
    }

    
  }

  _createDeps(rawDeps) {
    let arr = rawDeps.split(',');

    for (let c = 0; c < arr.length; c++) {
      arr[c] = arr[c].trim();
    }

    for (let c = 0; c < arr.length; c++) {
      let elm = arr[c];

      if (elm != '') {
        let token = elm.split(':');
        elm = token[1].trim();

        if (elm.indexOf("I") == 0) {
          if (elm[1].toUpperCase() == elm[1]) {
            elm = elm.substring(1, elm.length);
          }
        }

        arr[c] = elm;
      }
    }

    return arr;
  }

  _isIgnore(name) {
    for (let c = 0; c < this._ignores.length; c++) {
      let ignore = this._ignores[c];

      if (name == ignore) return true;
    }

    return false;
  }

  _isSingleton(name) {
    for (let c = 0; c < this._singles.length; c++) {
      let single = this._singles[c];

      //console.log("lhs(%s) == rhs(%s)", name, single);

      if (name == single) return true;
    }

    return false;
  }

  _getAllFiles(dirs) {
    let files = [];

    for (let c = 0; c < dirs.length; c++) {
      let dir = dirs[c];
      let f = [];
      f = this._readDir(dir, f);

      for (let d = 0; d < f.length; d++) {
        files.push(f[d]);
      }
    }

    return files;
  }

  _readDir(dir, filelist) {
    let files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = this._readDir(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.resolve(path.join(dir, file)));
        }
    });
    return filelist;
  }


  _createModule(path2) {
    return {name: null, path: path2, deps: [], isSingle: false};
  }
}

module.exports = CalculateDeps;
