import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OffchainItem } from '@viewer/models';
import { formatBytesSize } from '@traent/ts-utils';

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
