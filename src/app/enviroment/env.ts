export const environment = {
  production: false,
  apiHost: 'http://26.3.30.155',
  apiPort: 8080,
  get apiUrl() {
    return `${this.apiHost}:${this.apiPort}/api`;
  },
  get apiUrlImg() {
    return `${this.apiHost}:${this.apiPort}`;
  }
};
