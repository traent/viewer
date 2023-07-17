import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getHeaderControlFromRoute } from '@viewer/utils';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent {

  readonly showHeader = getHeaderControlFromRoute(this.route.snapshot);

  constructor(
    private readonly route: ActivatedRoute,
  ) { }
}
