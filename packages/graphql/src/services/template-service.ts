import { Eta } from 'eta';
import { BaseService } from '../bases/base-service';
import { TEMPLATES_PATH } from '../constants';
import { Config } from '../interfaces';
import type { AdocLiteral } from '../types';
import { GraphQLUtil, NumberUtil } from '../utils';
import { TranslateService } from './translate-service';

export class TemplateService extends BaseService {
  static readonly #engine = new Eta({
    views: TEMPLATES_PATH,
    useWith: true,
    rmWhitespace: false,
    autoTrim: false,
    autoEscape: false,
    cache: false,
    debug: true,
  });

  readonly name = 'TemplateService' as const;

  constructor(
    readonly config: Config,
    readonly translateService: TranslateService,
  ) {
    super(config);
  }

  async render(path: AdocLiteral, data: Record<string, any>) {
    const helpers = {
      isDefined: (input: any) => ![null, undefined].includes(input),
      notBlank: (input: string) => typeof input === 'string' && input.trim().length > 0,
      formatBytes: (value: number) => NumberUtil.formatBytes(value),
      printType: GraphQLUtil.printType,
      xref: GraphQLUtil.xref,
    } as const;
    const raw = TemplateService.#engine
      .render([path, 'eta'].join('.'), {
        ...data,
        helpers,
        translate: this.translateService.get.bind(this.translateService),
      })
      .replaceAll(/\n{3,}/gm, '\n\n')
      .trim();

    return Buffer.from(raw);
  }
}
