import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Note: this component/trick should removed ASAP.
 * Its aim is to allow the app to force-refresh the main `/project` components
 * when the selected `ledgerId` changes (ex: navigation from a cross-project reference log item).
 *
 * The right behavior would be to reconfigure all the components to depend on the
 * `ledgerId$` Observable to fetch the information they need.
 * Considering how much effort it would require, we decided to use this hack
 * as a first step.
 */
@Component({
  selector: 'app-ui-refresh-page',
  templateUrl: './ui-refresh-page.component.html',
  styleUrls: ['./ui-refresh-page.component.scss'],
})
export class UiRefreshPageComponent implements AfterViewInit {
  constructor(private readonly router: Router) { }

  ngAfterViewInit(): void {
    this.router.navigate(['/project']);
  }
}
