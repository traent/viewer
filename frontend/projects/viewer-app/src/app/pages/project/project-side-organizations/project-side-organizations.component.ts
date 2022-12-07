import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-side-organizations',
  templateUrl: './project-side-organizations.component.html',
  styleUrls: ['./project-side-organizations.component.scss'],
})
export class ProjectSideOrganizationsComponent {
  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
