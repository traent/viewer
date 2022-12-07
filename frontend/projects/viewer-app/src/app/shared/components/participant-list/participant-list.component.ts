import { Component, Input } from '@angular/core';
import { UIPaginator } from '@traent/ngx-paginator';
import { ProjectParticipant } from '@viewer/models';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent {

  @Input() paginator: UIPaginator<ProjectParticipant | null> | null = null;

}
