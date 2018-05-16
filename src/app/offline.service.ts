import { get, set } from 'idb-keyval';

export class OfflineService {
  stored: boolean;

  startDownload(list: string[]) {
    if ('serviceWorker' in navigator) {

      this.instructServiceWorker({ type: 'download', list })
        .then(this.downloadCompleted.bind(this))
        .catch(err => {
          console.log('error', err);
        });
    }
  }

  downloadCompleted(event) {
    this.stored = true;
    set('stored', this.stored);
  }

  constructor() {
    get<boolean>('stored').then(stored => {
      this.stored = stored;
    });
  }

  public instructServiceWorker(message) {
    return new Promise(function (resolve, reject) {

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function (event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      (navigator as any).serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
  }

}
