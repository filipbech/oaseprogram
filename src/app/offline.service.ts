import { get, set } from 'idb-keyval';
import { NgZone } from '@angular/core';

export class OfflineService {
  stored: boolean;

  startDownload(list: string[] = []) {
    if ('serviceWorker' in navigator && list.length) {
      this.instructServiceWorker({ type: 'download', list })
        .then(success => {
          this.stored = true;
          set('stored', this.stored);
          alert('Alle resourcer er nu cachet, og du kan nu fortsætte brugen uden forbindelse.');
        })
        .catch(err => {
          // silent catch
        })
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
      }, 500);
    });
  }

}
