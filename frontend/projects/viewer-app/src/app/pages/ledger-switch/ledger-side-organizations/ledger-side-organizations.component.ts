import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-ledger-side-organizations',
  templateUrl: './ledger-side-organizations.component.html',
  styleUrls: ['./ledger-side-organizations.component.scss'],
})
export class LedgerSideOrganizationsComponent {
  readonly ledgerId$ = this.route.params.pipe(map(({ ledgerId }) => ledgerId));

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
