import { Component, Input } from '@angular/core';
import { UIPaginator } from '@traent/ngx-paginator';

import { LedgerProjectParticipant } from '../../participants/participant';

@Component({
  selector: 'app-project-participants-list',
  templateUrl: './project-participants-list.component.html',
  styleUrls: ['./project-participants-list.component.scss'],
})
export class ProjectParticipantsListComponent {
  @Input() paginator?: UIPaginator<LedgerProjectParticipant | null>;
}
