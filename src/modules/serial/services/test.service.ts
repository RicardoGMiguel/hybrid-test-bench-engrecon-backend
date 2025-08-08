import { injectable } from 'tsyringe';

import { ITest } from '@modules/serial/interfaces/ITest';

@injectable()
class TestService {
  public async execute(): Promise<ITest[]> {
    const testDadta: ITest[] = [
      {
        name: 'foi1',
      },
      {
        name: 'foi2',
      },
      {
        name: 'foi2',
      },
    ];

    return testDadta;
  }
}

export default TestService;
