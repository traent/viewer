import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Project } from '../../project';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectInfoComponent {
  @Input() project?: Project;
}
