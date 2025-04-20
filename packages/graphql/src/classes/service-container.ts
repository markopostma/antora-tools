import type { Config, Service, ServiceConstructor } from '../interfaces';
import {
  IntrospectionService,
  LoggerService,
  MetaService,
  TemplateService,
  TranslateService,
} from '../services';
import type { Services } from '../types';

export class ServiceContainer {
  readonly #map = new Map<keyof Services, Service>();

  constructor(private readonly config: Config) {
    this.initialize();
  }

  get introspection() {
    return this.get(IntrospectionService);
  }

  get logger() {
    return this.get(LoggerService);
  }

  get meta() {
    return this.get(MetaService);
  }

  get translate() {
    return this.get(TranslateService);
  }

  get template() {
    return this.get(TemplateService);
  }

  private get<K extends ServiceConstructor>(serviceType: K) {
    return this.#map.get(serviceType.name as keyof Services) as InstanceType<K>;
  }

  private initialize() {
    const logger = this.factory(LoggerService, this.config);
    const meta = this.factory(MetaService, this.config, logger);
    const introspection = this.factory(IntrospectionService, this.config);
    const translate = this.factory(TranslateService, this.config, logger, meta.getMetaFile());
    const template = this.factory(TemplateService, this.config, translate);

    [logger, introspection, meta, translate, template].forEach((service) => {
      this.#map.set(service.name, service);
    });
  }

  private factory<K extends ServiceConstructor>(serviceType: K, ...args: ConstructorParameters<K>) {
    return new serviceType(...args) as InstanceType<K>;
  }
}
