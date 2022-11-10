import { Reader } from 'unzipit';

const round = (x: number, y: number) => x - x % y;

export const createSimpleReader = (source: string | Blob) =>
  typeof source === 'string'
    ? new HTTPRangeReader(source)
    : new BlobReader(source);

export const createReader = (source: string | Blob) =>
  new CachingReader(createSimpleReader(source));

export class BlobReader implements Reader {
  constructor(private readonly blob: Blob) {
  }
  async getLength(): Promise<number> {
    return this.blob.size;
  }

  async read(offset: number, size: number): Promise<Uint8Array> {
    return new Uint8Array(await this.blob.slice(offset, offset + size).arrayBuffer());
  }
}

export class HTTPRangeReader implements Reader {
  constructor(private readonly url: string) { }

  async getLength(): Promise<number> {
    const req = await fetch(this.url, { method: 'HEAD' });
    if (!req.ok) {
      throw new Error(`failed http request ${this.url}, status: ${req.status}: ${req.statusText}`);
    }
    const contentLength = req.headers.get('content-length');
    if (contentLength === null) {
      throw Error('could not get length');
    }
    const length = parseInt(contentLength, 10);
    if (Number.isNaN(length)) {
      throw Error('could not get length');
    }
    return length;
  }

  async read(offset: number, size: number): Promise<Uint8Array> {
    if (size === 0) {
      return new Uint8Array(0);
    }

    const req = await fetch(this.url, {
      headers: { Range: `bytes=${offset}-${offset + size - 1}` },
    });
    if (!req.ok) {
      throw new Error(`failed http request ${this.url}, status: ${req.status} offset: ${offset} size: ${size}: ${req.statusText}`);
    }
    const buffer = await req.arrayBuffer();
    return new Uint8Array(buffer);
  }
}

export class CachingReader implements Reader {
  private readonly chunks = new Map<number, Promise<Uint8Array>>();
  private readonly length$ = this.inner.getLength();

  constructor(
    private readonly inner: Reader,
    private readonly chunkSize = 128 * 1024,
    private readonly cacheSize = 4,
  ) { }

  async getLength(): Promise<number> {
    return this.length$;
  }

  async read(offset: number, size: number): Promise<Uint8Array> {
    if (size === 0) {
      return new Uint8Array(0);
    }

    const roundedOffset = round(offset, this.chunkSize);
    if (this.chunkSize <= 0 || roundedOffset !== round(offset + size - 1, this.chunkSize)) {
      // the request crosses a chunk boundary (it might be a huge request)
      // pass through, without caching it
      return this.inner.read(offset, size);
    }

    let chunk$ = this.chunks.get(roundedOffset);
    if (!chunk$) {
      chunk$ = this.inner.read(roundedOffset, this.chunkSize);
      if (this.chunks.size >= this.cacheSize) {
        const keys = [...this.chunks.keys()];
        this.chunks.delete(keys[Math.floor(keys.length * Math.random())]);
      }
      this.chunks.set(roundedOffset, chunk$);
    }
    const chunk = await chunk$;
    const begin = offset - roundedOffset;
    return chunk.subarray(begin, begin + size);
  }
}
