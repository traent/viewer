import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '@viewer/services';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-document-sidebar',
  templateUrl: './document-sidebar.component.html',
  styleUrls: ['./document-sidebar.component.scss'],
})
export class DocumentSidebarComponent {

  readonly document$ = this.route.params.pipe(
    switchMap(({ id }) => this.documentService.getDocument({ id })),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly documentService: DocumentService,
  ) { }

}
