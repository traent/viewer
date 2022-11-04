import { Pipe, PipeTransform } from '@angular/core';
import { u8ToBase64, u8ToHex, u8ToRaw } from '@viewer/utils';

@Pipe({ name: 'uint8' })
export class Uint8Pipe implements PipeTransform {

  transform(data: number | DotNet.InputByteArray, format?: 'base64' | 'hex' | 'raw'): string;
  transform(data: null | undefined, format?: 'base64' | 'hex' | 'raw'): null;
  transform(data: number | DotNet.InputByteArray | null | undefined, format?: 'base64' | 'hex' | 'raw'): string | null;
  // eslint-disable-next-line class-methods-use-this
  transform(data: number | DotNet.InputByteArray | null | undefined, format: 'base64' | 'hex' | 'raw' = 'base64'): string | null {
    if (data == null) {
      return null;
    }

    if (typeof data === 'number') {
      data = new Uint8Array([data]);
    }

    switch (format) {
      case 'base64': return u8ToBase64(data);
      case 'hex': return u8ToHex(data);
      case 'raw': return u8ToRaw(data);
      default: throw new Error(`Invalid format: ${format}`);
    }
  }
}
