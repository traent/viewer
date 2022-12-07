import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { formatBytesSize } from '@traent/ts-utils';
import { OffchainItem } from '@viewer/models';

@Component({
  selector: 'app-off-chain-row-item',
  templateUrl: './off-chain-row-item.component.html',
  styleUrls: ['./off-chain-row-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffChainRowItemComponent {
  @Input() value?: OffchainItem;
  @Input() hasKeyPair?: boolean = false;
  @Input() isOpen = false;

  readonly formatBytesSize = formatBytesSize;
}
