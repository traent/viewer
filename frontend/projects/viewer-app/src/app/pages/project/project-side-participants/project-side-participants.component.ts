import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectParticipantService } from '@viewer/services';
import { UIPaginator } from '@traent/ngx-paginator';

@Component({
  selector: 'app-project-side-participants',
  templateUrl: './project-side-participants.component.html',
  styleUrls: ['./project-side-participants.component.scss'],
})
export class ProjectSideParticipantsComponent {
  readonly participants = UIPaginator.makePlaceholderPaginator((page) =>
    this.projectParticipantService.getProjectParticipantCollection({ page, limit: 10 }),
  );

  constructor(
    private readonly projectParticipantService: ProjectParticipantService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
