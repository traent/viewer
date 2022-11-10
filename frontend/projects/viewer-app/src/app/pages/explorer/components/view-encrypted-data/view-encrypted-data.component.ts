import { shareReplay } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { isNotNullOrUndefined } from '@traent/ts-utils';

interface UIDataBlock {
  hasKey: boolean;
  getRaw(): Promise<Uint8Array>;
  getDecrypted(): Promise<Uint8Array>;
}

function* chunkData(data: Uint8Array) {
  for (let start =0; start < data.length; start += 16) {
    const end = start + 16;
    yield data.slice(start, end);
  }
}

@Component({
  selector: 'app-view-encrypted-data',
  templateUrl: './view-encrypted-data.component.html',
  styleUrls: ['./view-encrypted-data.component.scss'],
})
export class ViewEncryptedDataComponent {
  @Input() hasKeyPair = false;

  readonly uiDataBlock$ = new BehaviorSubject<UIDataBlock | undefined>(undefined);
  @Input() set uiDataBlock(dataBlock: UIDataBlock) {
    this.uiDataBlock$.next(dataBlock);
  }
  readonly decryptedData$ = this.uiDataBlock$.pipe(
    isNotNullOrUndefined(),
    switchMap((dataBlock) => dataBlock.getDecrypted()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly rawData$ = this.uiDataBlock$.pipe(
    isNotNullOrUndefined(),
    switchMap((dataBlock) => dataBlock.getRaw()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly chunkData = chunkData;

  decryptedViewMode = false;
}
