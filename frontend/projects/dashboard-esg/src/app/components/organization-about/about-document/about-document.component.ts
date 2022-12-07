import { Component } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-about-document',
  templateUrl: './about-document.component.html',
  styleUrls: ['./about-document.component.scss'],
})
export class AboutDocumentComponent {

  readonly pitchBook$ = this.appService.pitchBook$;

  readonly title$ = from(this.appService.getCompanyName()).pipe(
    map((companyName) => (
      companyName
        ? `About ${companyName}`
        : 'About the company'
    )),
  );

  constructor(private readonly appService: AppService) { }

}
