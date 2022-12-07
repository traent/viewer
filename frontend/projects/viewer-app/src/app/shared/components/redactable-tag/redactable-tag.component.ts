import { Component, Input } from '@angular/core';
import { isRedacted, Redactable } from '@traent/ngx-components';

@Component({
  selector: 'app-redactable-tag',
  templateUrl: './redactable-tag.component.html',
  styleUrls: ['./redactable-tag.component.scss'],
})
export class RedactableTagComponent {
  @Input() innerClasses?: string | string[];
  @Input() tagName?: Redactable<string>;
  @Input() color?: Redactable<string>;

  get tooltipLabel(): string {
    if (isRedacted(this.tagName)) {
      return 'Redacted';
    }

    if (!this.tagName) {
      return '';
    }

    return this.tagName;
  }
}
