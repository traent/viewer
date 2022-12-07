import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiDocumentsService {

  constructor() {
  }

  downloadDocument() {
    console.log(this);
  }

  shareDocument() {
    console.log(this);
  }
}
