type EnvironmentClass = {
  development: any;
  production: any;
};

type UseClass = EnvironmentClass | any;

export type Provider = {
  provideAs: string;
  useClass: UseClass;
  registerAs?: 'singleton' | 'instance';
};
