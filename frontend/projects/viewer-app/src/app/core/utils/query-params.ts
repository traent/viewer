import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Params } from '@angular/router';

export const getHeaderControlFromRoute = (state: ActivatedRouteSnapshot) =>
  !(state.queryParams['header'] && state.queryParams['header'] === 'false');

export const getHideCancelUploadControlFromRoute = (state: ActivatedRouteSnapshot) =>
  state.queryParams['hideCancelUpload'] && state.queryParams['hideCancelUpload'] === 'true';

export const getStyleFromRoute = (state: ActivatedRouteSnapshot) =>
  state.queryParams['style'] && JSON.parse(state.queryParams['style']);

export const extractNavigationValuesFromDefaultPage = (defaultPage: string) => {
  const commands = defaultPage.split('?');
  if (!commands.length) {
    return;
  }
  const baseUrlWithoutQueryParams = commands[0];
  const originalQueryParams: string | undefined = commands[1];
  const httpQueryParams = originalQueryParams ? new HttpParams({ fromString: originalQueryParams }) : undefined;
  const queryParams = httpQueryParams?.keys().reduce((params, key) => {
    params[key] = httpQueryParams.get(key);
    return params;
  }, {} as Params);

  return { baseUrlWithoutQueryParams, queryParams };
};
