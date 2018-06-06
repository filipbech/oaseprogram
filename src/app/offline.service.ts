import { get, set } from 'idb-keyval';
import { NgZone } from '@angular/core';

export class OfflineService {
  stored: boolean;

  startDownload(list: string[] = []) {
    if ('serviceWorker' in navigator && list.length && !this.stored && navigator.serviceWorker.controller) {
      alert('OaseProgram henter nu hele programmet for dig, så du fremover ikke behøver internetforbindelse.');
      this.instructServiceWorker({ type: 'download', list })
        .then(success => {
          this.stored = true;
          set('stored', this.stored);
          alert('Hele programmet er nu på din enhed! - Skulle det ændre sig undervejs, får du automatisk disse opdateringer med!');
        })
        .catch(err => {
          alert('Der skete en fejl ved download af programmet. Vi prøver automatisk igen lidt senere!');
          console.log(err);
          // semi-silent catch :-D
        });
    }
  }

  constructor() {
    get<boolean|undefined>('stored').then(stored => {
      this.stored = !!stored;
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
      }, 1500);
    });
  }

}
