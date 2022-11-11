import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectParticipantService } from '@viewer/services';
import { UIPaginator } from '@traent/ngx-paginator';

@Component({
  selector: 'app-project-side-organizations',
  templateUrl: './project-side-organizations.component.html',
  styleUrls: ['./project-side-organizations.component.scss'],
})
export class ProjectSideOrganizationsComponent {
  readonly organizations = UIPaginator.makePlaceholderPaginator((page) =>
    this.projectParticipantService.getOrganizationCollection({ page, limit: 10 }),
  );

  constructor(
    private readonly projectParticipantService: ProjectParticipantService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
