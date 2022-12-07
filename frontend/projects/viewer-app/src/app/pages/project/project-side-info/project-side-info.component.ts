import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-side-info',
  templateUrl: './project-side-info.component.html',
  styleUrls: ['./project-side-info.component.scss'],
})
export class ProjectSideInfoComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  innerNavigate(dst: 'organizations' | 'participants' | 'explorer' | 'cross-project-references') {
    if (dst === 'participants') {
      this.router.navigate(['participants'], { relativeTo: this.route, queryParamsHandling: 'merge' });
    } else if (dst === 'organizations') {
      this.router.navigate(['organizations'], { relativeTo: this.route, queryParamsHandling: 'merge' });
    } else if (dst === 'cross-project-references') {
      this.router.navigate(['linked-projects'], { relativeTo: this.route, queryParamsHandling: 'merge' });
    } else {
      this.router.navigate(['/explorer'], { queryParamsHandling: 'merge' });
    }
  }
}
