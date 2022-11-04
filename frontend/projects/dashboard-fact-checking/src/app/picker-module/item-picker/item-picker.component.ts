import { Component, Input, Output } from '@angular/core';
import { MaterialOrCustomIcon } from '@traent/ngx-components';
import { combineLatest, BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { trackById } from '@traent/ts-utils';

import { PickableItem } from '../picker.model';
import {
  pickInitialState,
  pickHasChanges,
  pickNextState,
} from '../picker.utils';

const getItemCounts = (items: string[], targets: ItemTarget[]): { [item: string]: number } => {
  const counts: { [item: string]: number } = {};
  items.forEach((item) => (counts[item] = 0));
  targets.forEach((target) => {
    target.items.forEach((item) =>
      counts[item] = counts[item] !== undefined
        ? counts[item] + 1
        : 1,
    );
  });
  return counts;
};

export interface ItemTarget {
  id: string;
  items: string[];
}

export interface PickedItemValue {
  item: string;
  value: 'checked' | 'unchecked' | undefined;
}

export interface PickedItemResult {
  item: string;
  value: 'checked' | 'unchecked';
}

@Component({
  selector: 'app-item-picker',
  templateUrl: './item-picker.component.html',
  styleUrls: ['./item-picker.component.scss'],
})
export class ItemPickerComponent {

  readonly itemTargets$ = new BehaviorSubject<ItemTarget[]>([]);
  @Input() set itemTargets(targets: ItemTarget[]) {
    this.itemTargets$.next(targets);
  }

  @Input() showDescription = false;
  @Input() allowMultiple = false;

  readonly items$ = new BehaviorSubject<string[]>([]);
  @Input() set items(items: string[]) {
    this.items$.next(items);
  }
  @Input() readonly getItemTranslationString?: (x: any) => string;
  @Input() readonly getItemDescriptionString?: (x: any) => string;
  @Input() readonly getItemIcon?: (x: any) => MaterialOrCustomIcon;

  readonly itemsPicked = new BehaviorSubject<PickedItemValue[]>([]);

  readonly itemsInitialValue$ = combineLatest([this.itemTargets$, this.items$]).pipe(
    map(([targets, items]) => (pickInitialState(getItemCounts(items, targets), targets.length))),
  );
  readonly itemsPickable$: Observable<PickableItem[]> = combineLatest([
    this.itemsInitialValue$,
    this.itemsPicked,
  ]).pipe(
    map(([itemsInitialValue, itemsPicked]) => (this.items$.value.map(( item ) => {
      const itemPicked = itemsPicked.find((r) => r.item === item);
      return {
        id: item,
        name: this.getItemTranslationString ? this.getItemTranslationString(item) : item,
        icon: this.getItemIcon ? this.getItemIcon(item) : undefined,
        description: this.showDescription && this.getItemDescriptionString ? this.getItemDescriptionString(item) : undefined,
        value: itemPicked && itemPicked.value ? itemPicked.value : itemsInitialValue[item],
      } as PickableItem;
    }))),
  );

  @Output() readonly itemsChanged = combineLatest([
    this.itemsInitialValue$,
    this.itemsPicked,
  ]).pipe(
    map(([initialValue, picked]) => pickHasChanges(
      initialValue,
      Object.assign({}, ...picked.map((x) => ({ [x.item]: x.value }))),
    )),
  );

  @Output() readonly itemsPickedResult = new BehaviorSubject<PickedItemResult[]>([]);

  readonly trackById = trackById;

  constructor() { }

  async selectItem(id: string) {

    if (!this.allowMultiple) {
      const nextValue: PickedItemResult[] = [];
      this.items$.value.forEach((el) => nextValue.push({ item: el, value: el === id ? 'checked' : 'unchecked'}));
      this.itemsPicked.next(nextValue);
      this.itemsPickedResult.next(nextValue);
      return;
    }

    const itemsPickable = await firstValueFrom(this.itemsPickable$);
    const item = itemsPickable.find((pickable) => pickable.id === id);
    if (!item) {
      return;
    }
    const initialValue = (await firstValueFrom(this.itemsInitialValue$))[item.id];
    const itemsPicked = (await firstValueFrom(this.itemsPicked));

    let itemPicked = itemsPicked.find((g) => g.item === item.id);
    if (itemPicked) {
      itemPicked.value = pickNextState(initialValue, itemPicked.value);
    } else {
      itemPicked = {
        item: id,
        value: pickNextState(initialValue, undefined),
      };
      itemsPicked.push(itemPicked);
    }
    this.itemsPicked.next(itemsPicked);
    this.itemsPickedResult.next(itemsPicked.filter((picked) => picked.value !== undefined) as PickedItemResult[]);
  }

}


