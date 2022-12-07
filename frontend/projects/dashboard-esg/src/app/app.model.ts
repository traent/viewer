/* eslint-disable max-len */
import { Redactable, isExportedAndDefined, RedactedMarker } from '@traent/ngx-components';
import { formatNumber } from './shared/format-utils';

export type IndicatorFormat = 'percentage' | 'largeNumber' | 'boolean' | undefined;

export interface IndicatorModel {
  title: string;
  type: 'soc' | 'gov' | 'env';
  icon: string;
  value: Redactable<number> | undefined | null;
  valueLabel: string | null;
  unit: string | undefined;
  year: number;
  average: Redactable<number> | undefined | null;
  averageLabel: string | null;
  maximum: number;
  description: string;
  hasDialog: boolean;
  tooltip: string | undefined;
}

export interface IndicatorDefinition {
  title: string;
  type: 'soc' | 'gov' | 'env';
  icon: string;
  unit: string | undefined;
  maximum: number | undefined;
  formatValue: IndicatorFormat;
  description: string; // html
  hasDialog: boolean;
  tooltip: string | undefined;
}

const formatLabel = (value: number, unit: IndicatorFormat): string => {
  switch (unit) {
    case 'percentage':
      return `${value}%`;
    case 'largeNumber':
      return formatNumber(value, { digits: 2, separator: '' } );
    case 'boolean':
      return value === 1 ? 'Yes' : 'No';
    default:
      return `${value}`;
  }
};

const valueLabel = (value: Redactable<number> | undefined | null, formatValue: IndicatorFormat) => value !== null && isExportedAndDefined(value)
  ? formatLabel(value, formatValue)
  : value === RedactedMarker ? 'Redacted' : 'No Data';

export const buildIndicatorModel = (
  definition: IndicatorDefinition,
  year: number,
  value: Redactable<number> | undefined | null,
  average: Redactable<number> | undefined | null): IndicatorModel => {
  const max = getMaximum(definition.maximum, value, average);
  return {
    title: definition.title,
    type: definition.type,
    icon: definition.icon,
    value,
    valueLabel: valueLabel(value, definition.formatValue),
    unit: definition.unit,
    year,
    average,
    averageLabel: valueLabel(average, definition.formatValue),
    maximum: max,
    description: definition.description,
    hasDialog: definition.hasDialog,
    tooltip: definition.tooltip,
  };
};

const getMaximum = (
  maximum: number | undefined,
  value: Redactable<number> | undefined | null,
  average: Redactable<number> | undefined | null) => {
  if (maximum) {
    return maximum;
  }
  const a = isExportedAndDefined(average) && average !== null ? average : undefined;
  const v = isExportedAndDefined(value) && value !== null ? value : undefined;

  if (a === undefined && v === undefined) {
    return 100;
  }
  const max = Math.max(a || 0, v || 0);
  return max;
};
