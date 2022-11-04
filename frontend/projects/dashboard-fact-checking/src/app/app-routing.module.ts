import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentContentComponent } from './components/document-content/document-content.component';

// import { DocumentDetailsComponent } from './components/document-details/document-details.component';
// import { DocumentListComponent } from './components/document-list/document-list.component';

const routes: Routes = [
  {
    path: 'documents',
    component: DocumentContentComponent,
  },
  {
    path: 'documents/:id',
    component: DocumentContentComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/documents',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
