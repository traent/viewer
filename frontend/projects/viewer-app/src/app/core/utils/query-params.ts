import { ActivatedRouteSnapshot } from '@angular/router';

export const getHeaderControlFromRoute = (state: ActivatedRouteSnapshot) =>
  !(state.queryParams['header'] && state.queryParams['header'] === 'false');

export const getHideCancelUploadControlFromRoute = (state: ActivatedRouteSnapshot) =>
  state.queryParams['hideCancelUpload'] && state.queryParams['hideCancelUpload'] === 'true';

export const getStyleFromRoute = (state: ActivatedRouteSnapshot) =>
  state.queryParams['style'] && JSON.parse(state.queryParams['style']);
