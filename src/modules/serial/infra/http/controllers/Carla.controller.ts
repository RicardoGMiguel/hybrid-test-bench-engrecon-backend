import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CarlaService from '@modules/serial/services/carla.service';

export default class CarlaController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { cmd } = req.body;

    const carlaService = container.resolve(CarlaService);

    const commandData = await carlaService.execute({
      cmd,
    });

    return res.json(commandData);
  }
}
