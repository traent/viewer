import { MediaMatcher, BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild, Input } from '@angular/core';
import { ChartType, ChartConfiguration, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { isExportedAndDefined, Redactable } from '@traent/ngx-components';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  breakpointsMapper,
  TWBreakpoint,
  BreakpointsQuery,
} from '../../../shared/breakpoints.utils';
import { getDatasetDataLabels, getBarChartOptions, colorMapper } from '../../../shared/chart-js.utils';
import { IndicatorModel } from '../../../app.model';

const getChartData = (max: number, value: number | undefined): number[] => {
  let v = value;
  if (v === undefined) {
    v = max / 2;
  }
  return [v];
};

const reduceValue = (value: Redactable<number> | undefined | null): number | undefined =>
  isExportedAndDefined(value) && value !== null ? value : undefined;

const getChartHeight = (breakpoint: TWBreakpoint) => {
  switch (breakpoint) {
    case 'xs':
    case 'sm':
      return 240;
    case 'md':
      return 266;
    case 'lg':
      return 400;
    case 'xl':
    case '2xl':
      return 500;
    default:
      return 266;
  }
};

@Component({
  selector: 'app-indicator-bar-chart',
  templateUrl: './indicator-bar-chart.component.html',
  styleUrls: ['./indicator-bar-chart.component.scss'],
})
export class IndicatorBarChartComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() indicatorModel?: IndicatorModel;
  @Input() company?: string;
  @Input() industry?: string;
  breakpoint?: TWBreakpoint;
  orientation?: 'landscape' | 'portrait' | undefined;

  barChartHeight? = 100;
  readonly barChartType: ChartType = 'bar';
  readonly barChartPlugins = [
    DataLabelsPlugin,
  ];
  readonly barChart$: Observable<{
    barChartOptions: ChartConfiguration['options'];
    barChartData: ChartData<'bar'>;
  }> = this.breakpointObserver.observe(BreakpointsQuery).pipe(
    map((breakpointState) => {
      this.breakpoint = breakpointsMapper(breakpointState);

      // required padding to contains labels
      const paddingBottom = 76;
      const chartHeight = getChartHeight(this.breakpoint);

      this.barChartHeight = chartHeight + paddingBottom;

      const value = reduceValue(this.indicatorModel?.value);
      const average = reduceValue(this.indicatorModel?.average);

      return {
        barChartOptions: getBarChartOptions(paddingBottom, this.indicatorModel?.maximum as number),
        barChartData: {
          labels: [this.indicatorModel?.year],
          datasets: [
            {
              data: getChartData(this.indicatorModel?.maximum as number, value),
              label: this.company || 'Company',
              backgroundColor: colorMapper(this.indicatorModel?.type, value),
              borderRadius: 10,
              borderSkipped: false,
              datalabels: getDatasetDataLabels(this.company || 'Company', this.indicatorModel?.valueLabel || null),
            },
            {
              data: getChartData(this.indicatorModel?.maximum as number, average),
              label: this.industry ? `[${this.industry}] Industry average` : 'Industry average',
              backgroundColor: colorMapper('average', average),
              borderRadius: 10,
              borderSkipped: false,
              datalabels: getDatasetDataLabels('Industry', this.indicatorModel?.averageLabel || null),
            },
          ],
        },
      };
    }),
  );

  constructor(
    private readonly mediaMatcher: MediaMatcher,
    private readonly breakpointObserver: BreakpointObserver,
  ) { }

}
