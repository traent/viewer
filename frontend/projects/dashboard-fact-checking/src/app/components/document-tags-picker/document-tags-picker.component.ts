import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { PickableItem } from '../../picker-module/picker.model';
import { Tag } from '../../tags';

@Component({
  selector: 'app-document-tags-picker',
  templateUrl: './document-tags-picker.component.html',
  styleUrls: ['./document-tags-picker.component.scss'],
})
export class DocumentTagsPickerComponent {

  readonly selectedTagId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set selectedTagId(value: string | undefined) {
    this.selectedTagId$.next(value);
  }

  readonly tags$ = new BehaviorSubject<Tag[]>([]);
  @Input() set tags(value: Tag[] | undefined) {
    this.tags$.next(value || []);
  }

  @Output() readonly applySelection = new EventEmitter<string>();
  @Output() readonly resetSelection = new EventEmitter<void>();

  /* Use to keep the element selection before apply it */
  readonly internalSelectedTagId$ = new BehaviorSubject<string | undefined>(undefined);

  readonly tagsPickable$ = combineLatest([
    this.tags$,
    this.selectedTagId$,
    this.internalSelectedTagId$,
  ]).pipe(
    map(([tags, selectedTagId, internalSelectedTagId]) => tags.map(({ id, name, color }) => ({
      id,
      name,
      color,
      value: internalSelectedTagId
        ? id === internalSelectedTagId ? 'checked' : 'unchecked'
        : id === selectedTagId ? 'checked' : 'unchecked',
    } as PickableItem),
    )),
  );

  selectTagHandler(id: string) {
    this.internalSelectedTagId$.next(id);
  }

  resetHandler() {
    this.internalSelectedTagId$.next(undefined);
    this.resetSelection.next();
  }
}
