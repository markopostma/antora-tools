import { BaseUtil } from '../bases/base-util';

export class NumberUtil extends BaseUtil<number> {
  formatBytes(decimals = 2) {
    if (this.input === 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const,
      i = Math.floor(Math.log(this.input) / Math.log(k));

    return parseFloat((this.input / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
