import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatar.service';

export default class AvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatarService.execute({
      user_id,
      avatarFileName: req.file?.filename,
    });

    return res.json(plainToInstance(User, user));
  }
}
