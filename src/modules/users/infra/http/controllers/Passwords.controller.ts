import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPassword.service';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmail.service';

export default class ResetPasswordController {
  public async reset(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;

    const resetPasswordService = container.resolve(ResetPasswordService);

    await resetPasswordService.execute({
      token,
      password,
    });

    return res.status(204).json();
  }

  public async forgot(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendForgotPasswordEmailService = container.resolve(SendForgotPasswordEmailService);

    await sendForgotPasswordEmailService.execute({
      email,
    });

    return res.status(204).json();
  }
}
