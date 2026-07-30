import { DataType } from 'node-opcua';
import { inject, singleton } from 'tsyringe';

import WebSocketOpcuaProvider from '@shared/container/providers/SerialProvider/implementations/WebSocketOPCUAProvider';

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
    @inject(WebSocketOpcuaProvider)
    private wsOpcuaProvider: WebSocketOpcuaProvider,
  ) {}

  public async execute({ cmd }: IRequest): Promise<string> {
    const commandReceive = JSON.stringify({ cmd });

    if (cmd === 'carla_start') {
      await this.wsOpcuaProvider.connect({
        onConnected: () => {
          console.log('Servidor iniciado com sucesso!');
        },
      });

      this.wsOpcuaProvider.onMessageFromPython = async (raw: string) => {
        const newData: IDataFromCarla = JSON.parse(raw);
        // console.log('newData', newData);

        const command = JSON.stringify({ cmd, speed: newData.speed, acceleration: newData.acceleration });
        console.log('foi enviado o comando:', command);

        await this.wsOpcuaProvider.writeTag('ns=1;s=CycleCmd', DataType.String, cmd);
        await this.wsOpcuaProvider.writeTag('ns=1;s=CycleSpeed', DataType.Double, newData.speed);
        await this.wsOpcuaProvider.writeTag('ns=1;s=CycleAcceleration', DataType.Double, newData.acceleration);
        await this.wsOpcuaProvider.writeTag('ns=1;s=CycleTotalTime', DataType.Double, 0); //não aplicável no carla
      };
    } else if (cmd === 'carla_stop') {
      console.log('carla interrompido');

      await this.wsOpcuaProvider.writeTag('ns=1;s=CycleCmd', DataType.String, cmd);

      await this.wsOpcuaProvider.disconnect();
    }

    return commandReceive;
  }
}

export default CarlaService;
