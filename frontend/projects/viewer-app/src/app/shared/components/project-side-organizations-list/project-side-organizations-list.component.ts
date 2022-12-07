import { Component, Input } from '@angular/core';
import { UIPaginator } from '@traent/ngx-paginator';
import { ProjectParticipantService } from '@viewer/services';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-project-side-organizations-list',
  templateUrl: './project-side-organizations-list.component.html',
  styleUrls: ['./project-side-organizations-list.component.scss'],
})
export class ProjectSideOrganizationsListComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(v: string | undefined) {
    this.ledgerId$.next(v);
  }

  readonly organizations$ = this.ledgerId$.pipe(
    map((ledgerId) => UIPaginator.makePlaceholderPaginator((page) =>
      this.projectParticipantService.getOrganizationCollection({ ledgerId, page, limit: 10 }),
    )),
  );

  constructor(private readonly projectParticipantService: ProjectParticipantService) { }
}
