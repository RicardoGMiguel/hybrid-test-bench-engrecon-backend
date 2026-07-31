import { config } from 'dotenv';
import { DataType } from 'node-opcua';
import { inject, injectable } from 'tsyringe';

import WebSocketOpcuaProvider from '@shared/container/providers/SerialProvider/implementations/WebSocketOPCUAProvider';

export enum CouplingModesEnum {
  FREE = 'FREE',
  LIGHT = 'LIGHT',
  HEAVY = 'HEAVY',
}

interface IRequest {
  cmd: string;
  mode?: CouplingModesEnum;
  cardanInitialSpeed: string;
  cardanEndSpeed: string;
  cardanTestTotalTime: string;
  couplingInstant: string;
}

@injectable()
class CommandService {
  constructor(
    @inject(WebSocketOpcuaProvider)
    private wsOpcuaProvider: WebSocketOpcuaProvider,
  ) {}

  public async execute({ cmd, mode, cardanInitialSpeed, cardanEndSpeed, cardanTestTotalTime, couplingInstant }: IRequest): Promise<string> {
    const command = JSON.stringify({ cmd, mode, cardanInitialSpeed, cardanEndSpeed, cardanTestTotalTime, couplingInstant });

    await this.wsOpcuaProvider.disconnect();

    await this.wsOpcuaProvider.connect({
      mustRegister: true,
      onConnected: () => {
        console.log('Servidor iniciado com sucesso!');
      },
    });

    await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.TestCmd', DataType.String, String(cmd));
    await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.TestTotalTime', DataType.Double, Number(cardanTestTotalTime));
    await this.wsOpcuaProvider.writeTag(
      'ns=4;s=|var|XP340.Application.OPCUA.TestCardanInitialSpeed',
      DataType.Double,
      Number(cardanInitialSpeed),
    );
    await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.TestCardanEndSpeed', DataType.Double, Number(cardanEndSpeed));
    await this.wsOpcuaProvider.writeTag(
      'ns=4;s=|var|XP340.Application.OPCUA.TestCouplingInstant',
      DataType.Double,
      Number(couplingInstant),
    );

    if (cmd === 'start') {
      config(); // carrega .env com SERIAL_PATH, SERIAL_BAUD, WS_PORT

      this.wsOpcuaProvider.onOPCUAData = (data: any) => {
        console.log('Callback externo recebeu:', data);
        // Aqui você poderia salvar no banco ou repassar para outro serviço
      };
    }

    return command;
  }
}

export default CommandService;
