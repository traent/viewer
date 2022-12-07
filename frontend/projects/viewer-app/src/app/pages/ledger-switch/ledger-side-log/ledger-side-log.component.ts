import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-ledger-side-log',
  templateUrl: './ledger-side-log.component.html',
  styleUrls: ['./ledger-side-log.component.scss'],
})
export class LedgerSideLogComponent {
  readonly ledgerId$: Observable<string | undefined> = this.route.params.pipe(map(({ ledgerId }) => ledgerId));

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
