import { get, set } from 'idb-keyval';

export class OfflineService {
  stored: boolean;

  startDownload(list: string[] = []) {
    if ('serviceWorker' in navigator && list.length) {
      this.instructServiceWorker({ type: 'download', list })
        .then(success => {
          this.stored = true;
          set('stored', this.stored);
        });
    }
  }

  constructor() {
    get<boolean>('stored').then(stored => {
      this.stored = stored;
    });
  }

  private instructServiceWorker(message) {
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
