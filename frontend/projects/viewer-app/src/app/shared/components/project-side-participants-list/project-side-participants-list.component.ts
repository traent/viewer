import { Component, Input } from '@angular/core';
import { UIPaginator } from '@traent/ngx-paginator';
import { ProjectParticipantService } from '@viewer/services';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-project-side-participants-list',
  templateUrl: './project-side-participants-list.component.html',
  styleUrls: ['./project-side-participants-list.component.scss'],
})
export class ProjectSideParticipantsListComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(v: string | undefined) {
    this.ledgerId$.next(v);
  }

  readonly participants = this.ledgerId$.pipe(
    map((ledgerId) => UIPaginator.makePlaceholderPaginator((page) =>
      this.projectParticipantService.getProjectParticipantCollection({ ledgerId, page, limit: 10 }),
    )),
  );

  constructor(private readonly projectParticipantService: ProjectParticipantService) { }
}
