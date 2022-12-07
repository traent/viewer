import { MaterialOrCustomIcon } from '@traent/ngx-components';

export type PickState = { [key: string]: 'checked' | 'unchecked' | 'indeterminate' };

export interface PickableItem {
  id: string;
  name: string;
  icon: MaterialOrCustomIcon;
  color?: string;
  description?: string;
  value: 'checked' | 'unchecked' | 'indeterminate' | undefined;
}
