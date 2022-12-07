import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContainerApiService {

  private readonly v1Api$ = import(/* webpackIgnore: true */ '../../../../well-known/view-v1.js');
  private readonly containerApi$ = this.v1Api$.then((module) => module.containerApi);


  async navigateByUrl(url: string) {
    const context = await this.containerApi$;
    return context.navigateByUrl(url);
  }
}
