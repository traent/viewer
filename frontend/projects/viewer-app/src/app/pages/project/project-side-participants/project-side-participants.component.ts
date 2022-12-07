import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-side-participants',
  templateUrl: './project-side-participants.component.html',
  styleUrls: ['./project-side-participants.component.scss'],
})
export class ProjectSideParticipantsComponent {
  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
