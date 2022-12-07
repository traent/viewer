import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-ledger-side-participants',
  templateUrl: './ledger-side-participants.component.html',
  styleUrls: ['./ledger-side-participants.component.scss'],
})
export class LedgerSideParticipantsComponent {
  readonly ledgerId$ = this.route.params.pipe(map(({ ledgerId }) => ledgerId));

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
