import type { Config, Service, ServiceConstructor } from '../interfaces';
import * as services from '../services';
import type { Services } from '../types';

export class ServiceContainer {
  readonly #map = new Map<keyof Services, Service>();

  constructor(private readonly rawConfig: Partial<Config>) {
    this.initialize();
  }

  get config() {
    return this.get(services.ConfigService);
  }

  get introspection() {
    return this.get(services.IntrospectionService);
  }

  get logger() {
    return this.get(services.LoggerService);
  }

  get meta() {
    return this.get(services.MetaService);
  }

  get translate() {
    return this.get(services.TranslateService);
  }

  get template() {
    return this.get(services.TemplateService);
  }

  private get<K extends ServiceConstructor>(serviceType: K) {
    return this.#map.get(serviceType.name as keyof Services) as InstanceType<K>;
  }

  private initialize() {
    const configService = this.factory(services.ConfigService, this.rawConfig);
    const logger = this.factory(services.LoggerService, configService.config);
    const meta = this.factory(services.MetaService, configService.config, logger);
    const introspection = this.factory(services.IntrospectionService, configService.config);
    const translate = this.factory(
      services.TranslateService,
      configService.config,
      logger,
      meta.getMetaFile(),
    );
    const template = this.factory(services.TemplateService, configService.config, translate);

    [configService, logger, introspection, meta, translate, template].forEach((service) => {
      this.#map.set(service.name, service);
    });
  }

  private factory<K extends ServiceConstructor>(serviceType: K, ...args: ConstructorParameters<K>) {
    return new serviceType(...args) as InstanceType<K>;
  }
}
