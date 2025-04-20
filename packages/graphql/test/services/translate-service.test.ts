import { randomUUID } from 'node:crypto';
import { DEFAULT_CONFIG } from '../../src/constants';
import { Locale } from '../../src/enums';
import type { Config, LocaleData } from '../../src/interfaces';
import { LoggerService } from '../../src/services';
import * as locales from '../../src/services/locales';
import { TranslateService } from '../../src/services/translate-service';

describe('TranslateService', () => {
  const config = { ...DEFAULT_CONFIG } as any as Config;

  let loggerService: LoggerService;
  let translateService: TranslateService;

  beforeEach(() => {
    loggerService = new LoggerService(config);
    translateService = new TranslateService(config, loggerService);
  });

  it('creates', () => {
    expect(translateService).toBeInstanceOf(TranslateService);
  });

  it('has default language EN', () => {
    expect(translateService['config'].locale).toEqual('en');
  });

  it('falls back to default locale when locale is not supported', () => {
    translateService = new TranslateService({ ...config, locale: 'usa' as any }, loggerService);

    expect(translateService.data).toEqual(locales.en);
  });

  describe.each([Locale.German, Locale.English, Locale.Spanish, Locale.Dutch])(
    'get() returns value based on locale',
    (locale) => {
      const localeData = locales[locale];
      const keys = [
        'arguments',
        'definition',
        'downloads',
        'enumValues',
        'example',
        'fields',
        'implementations',
        'implementedBy',
        'inputFields',
        'locations',
        'possibleTypes',
        'repeatable',
        'request',
        'returnType',
      ] satisfies Array<keyof LocaleData>;

      it(`has all keys in locale ${locale}`, () => {
        translateService = new TranslateService({ ...config, locale }, loggerService);

        expect(Object.keys(localeData).length).toEqual(keys.length);

        for (const key of keys) {
          expect(localeData[key]).toEqual(translateService.get(key));
        }
      });

      it('allows overrides', () => {
        for (const key of keys) {
          const testValue = randomUUID();

          translateService = new TranslateService(config, loggerService, {
            LOCALE: { [key]: testValue },
          });

          expect(translateService.get(key)).toEqual(testValue);
        }
      });
    },
  );
});
