import { Writable } from 'stream';

export class HtmlWritable extends Writable {
  chunks = [];
  html = '';

  getHtml() {
    return this.html;
  }

  override _write(chunk: any, _encoding: any, callback: () => void) {
    // @ts-expect-error bla bla bla TODO
    this.chunks.push(chunk);
    callback();
  }

  override _final(callback: () => void) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}
