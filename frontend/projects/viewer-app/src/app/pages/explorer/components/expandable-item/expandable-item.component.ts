import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { blockEncapsulation } from '@viewer/models';
import { fromPascalCaseToKebabCase, parsePolicyV1 } from '@viewer/utils';
import { formatBytesSize } from '@traent/ts-utils';

const decode = (str: string) => decodeURIComponent(atob(str));
const getBlockTypeDetailsFromBlockTypeCode =  (blockTypeCode: string) => {
  const blockTypes = Object.keys(blockEncapsulation) as Array<keyof typeof blockEncapsulation>;
  const blockTypeMatch = blockTypes.find((type) => blockEncapsulation[type].shortName === blockTypeCode);
  if (!blockTypeMatch) {
    throw new Error(`Block type "${blockTypeCode}" not found`);
  }
  return {
    class: fromPascalCaseToKebabCase(blockTypeMatch),
    fullName: blockEncapsulation[blockTypeMatch].fullName,
  };
};

@Component({
  selector: 'app-expandable-item',
  templateUrl: './expandable-item.component.html',
  styleUrls: ['./expandable-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableItemComponent {
  @Input() block?: Ledger.Parser.Block;

  readonly parsePolicyV1 = parsePolicyV1;
  readonly formatBytesSize = formatBytesSize;
  readonly decode = decode;
  readonly getBlockTypeDetailsFromBlockTypeCode = getBlockTypeDetailsFromBlockTypeCode;
}
