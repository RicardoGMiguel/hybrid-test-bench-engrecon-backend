import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CommandService from '@modules/serial/services/command.service';

export default class CommandController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { cmd, mode, cardanSpeed, rampTime } = req.body;

    const commandService = container.resolve(CommandService);

    const commandData = await commandService.execute({
      cmd,
      mode,
      cardanSpeed,
      rampTime,
    });

    return res.json(commandData);
  }
}
