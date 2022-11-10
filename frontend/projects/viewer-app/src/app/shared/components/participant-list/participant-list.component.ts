import { Component, Input } from '@angular/core';
import { ProjectParticipant } from '@viewer/models';
import { UIPaginator } from '@traent/ngx-paginator';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent {

  @Input() paginator: UIPaginator<ProjectParticipant | null> | null = null;

}
