import { ChangeDetectionStrategy, Component } from '@angular/core';
import { blockEncapsulation, BlockItem } from '@viewer/models';
import { isEncapsulation, StorageService } from '@viewer/services';
import { fromPascalCaseToKebabCase } from '@viewer/utils';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { TablePaginatorData, tableOffset } from '@traent/ngx-components';

const expandBlocks = async (blockItem: BlockItem) => {
  let currentBlock: Ledger.Parser.Block = await blockItem.getParsed();
  let dataBlock: Ledger.Parser.DataBlock | undefined;
  const blocks: Ledger.Parser.Block[] = [currentBlock];
  while (isEncapsulation(currentBlock)) {
    currentBlock = currentBlock.inner;
    if (currentBlock.type === 'Data') {
      dataBlock = currentBlock;
    }
    blocks.push(currentBlock);
  }
  return { blocks, dataBlock };
};

@Component({
  selector: 'app-block-tab-content',
  templateUrl: './block-tab-content.component.html',
  styleUrls: ['./block-tab-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockTabContentComponent {

  readonly totalBlockItems$ = this.storageService.getCompleteBlocksCount();
  readonly keyPair$ = this.storageService.getKeyPair();

  readonly pageEvent$ = new BehaviorSubject<TablePaginatorData>({
    pageIndex: 0,
    pageSize: 25,
  });

  readonly blockItems$ = combineLatest([
    this.pageEvent$,
    this.totalBlockItems$,
  ]).pipe(
    switchMap(([pageEvent, totalBlockItems]) => {
      const offset = tableOffset(pageEvent);
      const limit = Math.min(pageEvent.pageSize, totalBlockItems - offset);
      return this.storageService.getBlocks(offset, limit);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly expandBlocks = expandBlocks;
  readonly blockEncapsulation = blockEncapsulation;
  readonly fromPascalCaseToKebabCase = fromPascalCaseToKebabCase;

  constructor(
    private readonly storageService: StorageService,
  ) { }
}
