import { inject, singleton } from 'tsyringe';

import WebSocketSerialProvider from '@shared/container/providers/SerialProvider/implementations/WebSocketSerialProvider';

interface IRequest {
  cmd: string;
}

export interface IDataFromCarla {
  speed: number;
  acceleration: number;
}

@singleton()
class CarlaService {
  constructor(
    @inject(WebSocketSerialProvider)
    private wsSerialProvider: WebSocketSerialProvider,
  ) {}

  public async execute({ cmd }: IRequest): Promise<string> {
    const commandReceive = JSON.stringify({ cmd });

    if (cmd === 'carla_start') {
      await this.wsSerialProvider.connect({
        onConnected: () => {
          console.log('Servidor iniciado com sucesso!');
        },
      });

      this.wsSerialProvider.onMessageFromPython = async (raw: string) => {
        const newData: IDataFromCarla = JSON.parse(raw);
        // console.log('newData', newData);

        const command = JSON.stringify({ cmd, speed: newData.speed, acceleration: newData.acceleration });
        console.log('foi enviado o comando:', command);

        await this.wsSerialProvider.sendSerialData(command);
      };
    } else if (cmd === 'carla_stop') {
      console.log('carla interrompido');

      const command = JSON.stringify({ cmd });
      await this.wsSerialProvider.sendSerialData(command);

      await this.wsSerialProvider.disconnect();
    }

    return commandReceive;
  }
}

export default CarlaService;
