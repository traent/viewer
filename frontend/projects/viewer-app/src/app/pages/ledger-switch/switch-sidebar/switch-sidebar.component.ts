import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-switch-sidebar',
  templateUrl: './switch-sidebar.component.html',
  styleUrls: ['./switch-sidebar.component.scss'],
})
export class SwitchSidebarComponent {
  readonly ledgerSelected$ = this.route.params.pipe(map(({ ledgerId }) => !!ledgerId));

  constructor(private readonly route: ActivatedRoute) { }
}
