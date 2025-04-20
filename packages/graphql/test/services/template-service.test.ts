import { EtaFileResolutionError } from 'eta';
import { DEFAULT_CONFIG } from '../../src/constants';
import type { Config } from '../../src/interfaces';
import { LoggerService } from '../../src/services';
import { TemplateService } from '../../src/services/template-service';
import { TranslateService } from '../../src/services/translate-service';

describe('TemplateService', () => {
  let templateService: TemplateService;
  let loggerService: LoggerService;

  const config = { ...DEFAULT_CONFIG } as any as Config;

  beforeEach(() => {
    loggerService = new LoggerService(config);
    templateService = new TemplateService(config, new TranslateService(config, loggerService));
  });

  describe('render', () => {
    describe('when found', () => {
      it('returns a Buffer', async () => {
        const rendered = await templateService.render('index.adoc', {
          config: { introspection: {}, component: {} } as any,
          data: {
            title: 'Test',
            indexPages: {},
          },
        });

        expect(rendered).toBeInstanceOf(Buffer);
      });
    });

    describe('when not found', () => {
      it('throws an EtaFileResolutionError', (done) => {
        templateService.render('not_found_template.adoc', { config: {} as any }).catch((e) => {
          expect(e).toBeInstanceOf(EtaFileResolutionError);
          done();
        });
      });
    });
  });
});
