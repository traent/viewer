import { PickState } from './picker.model';

export const pickInitialState = (counts: { [key: string]: number }, total: number): PickState => {
  const state: PickState = {};
  Object.keys(counts).forEach((key) => (
    state[key] =
      counts[key] === 0
        ? 'unchecked'
        : counts[key] === total
          ? 'checked'
          : 'indeterminate'
  ));
  return state;
};

export const pickNextState = (
  initialValue: 'checked' | 'unchecked' | 'indeterminate',
  currentValue: 'checked' | 'unchecked' | undefined,
): 'checked' | 'unchecked' | undefined => {
  switch (initialValue) {
    case 'indeterminate':
      switch (currentValue) {
        case 'checked':
          return 'unchecked';
        case 'unchecked':
          return undefined;
        case undefined:
          return 'checked';
      }
      break;
    case 'unchecked':
      switch (currentValue) {
        case 'checked':
          return 'unchecked';
        case 'unchecked':
        case undefined:
          return 'checked';
      }
      break;
    case 'checked':
      switch (currentValue) {
        case 'checked':
        case undefined:
          return 'unchecked';
        case 'unchecked':
          return 'checked';
      }
  }
};

export const pickHasChanges = (initialValue: PickState, picked: { [key: string]: 'checked' | 'unchecked' | undefined} ): boolean =>
  Object.keys(initialValue).some((key) => picked[key] !== undefined && picked[key] !== initialValue[key]);


