import { Component } from '@angular/core';

@Component({
  selector: 'app-live-stream',
  template: `
    <h1>Livestream</h1>
    <p>Her kan du se live-video fra årets sommeroase. Du kan finde optagelser fra i år og tidligere år på <a href="https://www.youtube.com/c/danskoase" rel="noopener" target="_blank">vores youtube kanal</a>.</p>
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
