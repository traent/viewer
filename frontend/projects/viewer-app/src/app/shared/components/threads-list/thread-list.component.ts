import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UIPaginator } from '@traent/ngx-paginator';
import { Thread, ThreadCategories } from '@viewer/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss'],
})
export class ThreadListComponent {

  readonly query$ = new BehaviorSubject<string>('');
  set query(value: string) {
    this.query$.next(value);
  }
  get query(): string {
    return this.query$.value;
  }

  @Input() paginator: UIPaginator<Thread | null> | null = null;
  @Input() tab: any;
  @Input() activeThreadId: string | null = null;
  @Input() hideSearch = true;
  @Input() labelContext: 'project' | 'document' = 'project';

  @Output() readonly tabClick = new EventEmitter<ThreadCategories>();
  @Output() readonly itemClick = new EventEmitter<Thread>();
  @Output() readonly search = this.query$.asObservable();

}
