import { Writable } from 'stream';

export class HtmlWritable extends Writable {
  chunks: Buffer[] = [];
  html = '';

  getHtml() {
    return this.html;
  }

  override _write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    this.chunks.push(chunk);
    callback();
  }

  override _final(callback: (error?: Error | null) => void) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}
