import { Request, Response } from 'express';
import { container } from 'tsyringe';

import TestService from '@modules/serial/services/test.service';

export default class TestController {
  public async index(req: Request, res: Response): Promise<Response> {
    const testService = container.resolve(TestService);

    const testData = await testService.execute();

    return res.json(testData);
  }
}
