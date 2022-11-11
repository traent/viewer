export interface ZipEntry {
  blob(type?: string): Promise<Blob>;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json(): Promise<unknown>;
  name: string;
  size: number;
}
