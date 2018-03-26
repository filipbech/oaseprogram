import { Component } from '@angular/core';

@Component({
  selector: 'app-live-stream',
  template: `
    <h1>Livestream</h1>
    <p>this is currently from ÅVM, but should show from SommerOase</p>
    <div class="video-container">
      <iframe
        frameborder="0"
        allow="autoplay; encrypted-media"
        src="//www.youtube.com/embed/live_stream?channel=UC8-K5ImW5BxS07OgpmSlyPQ"
        allowfullscreen></iframe>
    </div>
  `
})
export class LiveStreamComponent {
}
