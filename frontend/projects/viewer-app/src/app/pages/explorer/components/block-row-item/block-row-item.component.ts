import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { formatBytesSize } from '@traent/ts-utils';
import { blockEncapsulation, BlockItem } from '@viewer/models';
import { fromPascalCaseToKebabCase } from '@viewer/utils';

@Component({
  selector: 'app-block-row-item',
  templateUrl: './block-row-item.component.html',
  styleUrls: ['./block-row-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockRowItemComponent {
  @Input() blockItem?: BlockItem;
  @Input() isOpen = false;

  readonly blockEncapsulation = blockEncapsulation;

  readonly formatBytesSize = formatBytesSize;
  readonly fromPascalCaseToKebabCase = fromPascalCaseToKebabCase;
}
