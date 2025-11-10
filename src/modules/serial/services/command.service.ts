import { config } from 'dotenv';
import { inject, injectable } from 'tsyringe';

import WebSocketSerialProvider from '@shared/container/providers/SerialProvider/implementations/WebSocketSerialProvider';

export enum CouplingModesEnum {
  FREE = 'FREE',
  LIGHT = 'LIGHT',
  HEAVY = 'HEAVY',
}

interface IRequest {
  cmd: string;
  mode: CouplingModesEnum;
  cardanInitialSpeed: string;
  cardanEndSpeed: string;
  cardanTestTotalTime: string;
  couplingInstant: string;
}

@injectable()
class CommandService {
  constructor(
    @inject(WebSocketSerialProvider)
    private wsSerialProvider: WebSocketSerialProvider,
  ) {}

  public async execute({ cmd, mode, cardanInitialSpeed, cardanEndSpeed, cardanTestTotalTime, couplingInstant }: IRequest): Promise<string> {
    const command = JSON.stringify({ cmd, mode, cardanInitialSpeed, cardanEndSpeed, cardanTestTotalTime, couplingInstant });

    await this.wsSerialProvider.disconnect();

    await this.wsSerialProvider.sendSerialData(command);

    if (cmd === 'start') {
      config(); // carrega .env com SERIAL_PATH, SERIAL_BAUD, WS_PORT

      this.wsSerialProvider.onSerialData = (data: any) => {
        console.log('Callback externo recebeu:', data);
        // Aqui você poderia salvar no banco ou repassar para outro serviço
      };

      await this.wsSerialProvider.connect({
        onConnected: () => {
          console.log('Servidor iniciado com sucesso!');
        },
      });
    }

    return command;
  }
}

export default CommandService;
