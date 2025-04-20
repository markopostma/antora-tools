declare module '@antora/ui-loader' {
  import { AddFileDescriptor } from '@antora/content-classifier';

  /**
   * @see https://gitlab.com/antora/antora/-/blob/main/packages/ui-loader/lib/ui-catalog.js?ref_type=heads
   */
  export class UiCatalog {
    getFiles(): any[];
    addFile(file: Partial<AddFileDescriptor>): AddFileDescriptor;
    removeFile(file: any): boolean;
    findByType(type: string): AddFileDescriptor;
  }
}
