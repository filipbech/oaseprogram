import { Component } from '@angular/core';

@Component({
  selector: 'app-live-stream',
  template: `
    <h1>Livestream</h1>
    <p>Her kan du se live-video fra årets sommeroase. Du kan finde optagelser fra i år og tidligere år på <a href="https://www.youtube.com/channel/UC8-K5ImW5BxS07OgpmSlyPQ/live" rel="noopener" target="_blank">vores youtube kanal</a>.</p>
    <a href="https://www.youtube.com/channel/UC8-K5ImW5BxS07OgpmSlyPQ/live" rel="noopener" target="_blank" class="stream-image">
      <img src="/assets/stream.jpg" />
    </a>
  `
})
export class LiveStreamComponent {
}
