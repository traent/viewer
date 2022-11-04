import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

const LINK_VALIDATOR = /(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.\w+(:\d+)?(\/[\w-=.?]+)*\/?/;

@Component({
  selector: 'app-remote-uploader',
  templateUrl: './remote-uploader.component.html',
  styleUrls: ['./remote-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteUploaderComponent {
  @Output() readonly urlOpen = new EventEmitter<string>();
  @Output() readonly inputClose = new EventEmitter<void>();

  readonly form = this.fb.group({
    url: ['', [Validators.required,  Validators.pattern((LINK_VALIDATOR))]],
  });

  constructor(private readonly fb: UntypedFormBuilder) { }
}
