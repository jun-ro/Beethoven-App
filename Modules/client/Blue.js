export class Blue {
  constructor(path) {
    this.path = path;
  }

  Store(element, key, value) {
    element.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=${this.path}`
  }

  Read(element, key) {
    return element.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1");
  }
}
