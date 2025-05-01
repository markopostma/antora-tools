export class NumberUtil {
  static formatBytes(input: number, decimals = 2) {
    if (input === 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const,
      i = Math.floor(Math.log(input) / Math.log(k));

    return [parseFloat((input / Math.pow(k, i)).toFixed(dm)), sizes[i]].join('');
  }
}
