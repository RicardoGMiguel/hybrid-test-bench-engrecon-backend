import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CycleService from '@modules/serial/services/cycles.service';

export default class CycleController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { cmd, cycle } = req.body;

    const cycleService = container.resolve(CycleService);

    const commandData = await cycleService.execute({
      cmd,
      cycle,
    });

    return res.json(commandData);
  }
}
