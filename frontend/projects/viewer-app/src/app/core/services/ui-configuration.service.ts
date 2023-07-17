import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

interface UIConfiguration {
  style?: Record<string, string>;
  header?: boolean;
  hideCancelUpload?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UiConfigurationService {

  private uiConfiguration?: UIConfiguration = {
    header: true,
    hideCancelUpload: false,
  };

  get header() {
    return this.uiConfiguration?.header;
  }

  get hideCancelUpload() {
    return this.uiConfiguration?.hideCancelUpload;
  }

  get style() {
    return this.uiConfiguration?.style;
  }

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly http: HttpClient,
  ) {
    this.http.get('./assets/ui-configuration.json').subscribe((conf) => {
      this.setUiConfiguration(conf as UIConfiguration);
    });
  }

  setUiConfiguration(conf: UIConfiguration) {
    conf = Object.keys(conf).reduce((acc, key) => {
      const _acc = acc;
      const keyCast = key as keyof typeof conf;
      const propValue = conf[keyCast];
      // FIXME: Improve typing
      if (propValue !== undefined) {
        (_acc as any)[keyCast] = propValue;
      }
      return _acc;
    }, {} as UIConfiguration);

    this.uiConfiguration = {
      ...this.uiConfiguration,
      ...conf,
    };

    if (conf.style && typeof conf.style === 'object') {
      Object.keys(conf.style).forEach((key) => {
        if (conf.style && conf.style[key]) {
          this.document.documentElement.style.setProperty(key, conf.style[key]);
        }
      });
    }
  }
}
