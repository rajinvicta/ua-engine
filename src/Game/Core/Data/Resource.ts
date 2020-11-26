import ResType from './ResType';

class Resource {
  private _type: string;
  private _url: string;
  private _name: string;
  private _basename: string; // filename, without extension
  private _loaded: boolean;
  private _data: any;
  private _ext: string;

  constructor() {
    this._type = ResType.BLANK;
    this._url = '';
    this._name = '';
    this._basename = '';
    this._ext = '';
    this._loaded = false;
    this._data = null;
  }

  get data(): any {
    return this._data;
  }

  get name(): string {
    return this._name;
  }

  /**
   * @description returns the basename of the file, without file extension
   */
  get basename(): string {
    return this._basename;
  }

  get url(): string {
    return this._url;
  }

  get loaded(): boolean {
    return this._loaded;
  }

  get ext(): string {
    return this._ext;
  }

  set data(dat: any) {
    this._data = dat;
  }

  set loaded(ld: boolean) {
    this._loaded = ld;
  }

  // also currently used to load atlas files. No distinction, other than file extension provided...
  public initImage(url: string, loaded: boolean) {
    let type = this._getImgTag();

    this._init(type, url, loaded);
  }

  // same as initImg, except assigns different type tag - 'spn'
  public initSpine(url: string, loaded: boolean) {
    let type = this._getSpnTag();

    this._init(type, url, loaded);
  }

  // url is provided with no file extension, because there are 2 -- ogg and mp3
  public initSnd(url: string, loaded: boolean) {
    let type = this._getSndTag();

    this._init(type, url, loaded);
  }

  public initJSON(url: string, loaded: boolean) {
    let type = this._getJSONTag();

    this._init(type, url, loaded);
  }

  public isImg(): boolean {
    if (this._type == ResType.IMG) {
      return true;
    } else {
      return false;
    }
  }

  public isSnd(): boolean {
    if (this._type == ResType.SND) {
      return true;
    } else {
      return false;
    }
  }

  public isSpn(): boolean {
    if (this._type == ResType.SPN) {
      return true;
    } else {
      return false;
    }
  }

  public createNew(): Resource {
    return new Resource();
  }

  private _init(type: string, url: string, loaded: boolean) {
    this._type = type;
    this._url = url;
    this._loaded = loaded;
    this._name = this._getName(url);
    this._ext = this._getExtension(url);
    this._basename = this._name;
  }

  private _getImgTag(): string {
    return ResType.IMG;
  }

  private _getSndTag(): string {
    return ResType.SND;
  }

  private _getSpnTag(): string {
    return ResType.SPN;
  }

  private _getJSONTag(): string {
    return ResType.JSN;
  }

  /* private _getName(url: string): string {
    let arr = this._getURLChunks(url);
    let filename = arr[arr.length - 1];
    let nameArr = filename.split('.');
    nameArr.pop();
    let name = '';

    for (let c = 0; c < nameArr.length; c++) {
      let current = nameArr[c];
      if (c > 0) {
        name = name + '.' + current;
      } else {
        name = current;
      }
    }

    //console.log("name: %s", name);

    return name;
  } */

  // WIP
  private _getName(url: string) {
    return this._filenameArrFromURL(url)[0];
  }

  private _getExtension(url: string) {
    let arr = this._filenameArrFromURL(url);
    if(arr.length > 1){

    }
    return arr[1];
  }

  private _getURLChunks(url: string) : string[] {
    return url.trim().split('/');
  }

  /**
   * @description extracts the basename, and extension from a URL.
   * @param url the URL to extract from
   */
  private _filenameArrFromURL(url: string): string[]{
    let chunks = this._getURLChunks(url);
    return chunks[chunks.length - 1].split('.');
  }
}
export default Resource;