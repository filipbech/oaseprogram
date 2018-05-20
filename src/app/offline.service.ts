import { get, set } from 'idb-keyval';
import { NgZone } from '@angular/core';

export class OfflineService {
  stored: boolean;

  startDownload(list: string[] = []) {
    console.log('startdownload', list);
    if ('serviceWorker' in navigator && list.length) {
      this.instructServiceWorker({ type: 'download', list })
        .then(success => {
          console.log('succes back in service');
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
    return new Promise((resolve, reject) => {

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = event => {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      setTimeout(_ => {
        (navigator as any).serviceWorker.controller.postMessage(message, [messageChannel.port2]);
      }, 1000);
    });
  }

}
