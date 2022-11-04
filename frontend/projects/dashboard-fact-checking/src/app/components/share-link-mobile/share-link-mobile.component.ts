import { Component } from '@angular/core';

import { StreamsService } from '../../streams';

@Component({
  selector: 'app-share-link-mobile',
  templateUrl: './share-link-mobile.component.html',
  styleUrls: ['./share-link-mobile.component.scss'],
})
export class ShareLinkMobileComponent {

  readonly mainArticleUrl$ = this.streamsService.getStreamByMachineName('X-wordpress-news-url').then((s) => s?.value);

  constructor(
    private readonly streamsService: StreamsService,
  ) {
  }
}
