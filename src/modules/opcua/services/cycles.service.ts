import * as fs from 'fs';
import * as path from 'path';
import { DataType } from 'node-opcua';
import { inject, singleton } from 'tsyringe';

import WebSocketOpcuaProvider from '@shared/container/providers/SerialProvider/implementations/WebSocketOPCUAProvider';

export enum CyclesEnum {
  HFET = 'HFET',
  UDDS = 'UDDS',
}

interface DataPoint {
  time: number;
  speed: number;
}

interface IRequest {
  cmd: string;
  cycle: CyclesEnum;
}

@singleton()
class CycleService {
  public shouldStop = false; // flag de controle

  constructor(
    @inject(WebSocketOpcuaProvider)
    private wsOpcuaProvider: WebSocketOpcuaProvider,
  ) {}

  public async execute({ cmd, cycle }: IRequest): Promise<string> {
    const commandReceive = JSON.stringify({ cmd, cycle });

    function delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    await this.wsOpcuaProvider.disconnect();

    await this.wsOpcuaProvider.connect({
      onConnected: () => {
        console.log('Servidor iniciado com sucesso!');
      },
    });

    if (cmd === 'cycle_start') {
      this.shouldStop = false;
      // lê o conteúdo do arquivo
      const fileContent = fs.readFileSync(path.resolve(`src/modules/serial/services/cycleFiles/${cycle}.txt`), 'utf-8');

      const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
      const cycleData: DataPoint[] = lines.map(line => {
        const [timeStr, speedStr] = line.trim().split(/\s+/);
        return {
          time: Number(timeStr),
          speed: Number(speedStr) * 1.60934,
        };
      });

      let velocidadeAnterior = 0;
      let tempoAnterior = Date.now();
      let totalTime = 0;

      for (let i = 1; i < cycleData.length; i++) {
        if (this.shouldStop) break; // <<<<<<<<<<<<<< STOP
        const speed = cycleData[i].speed;

        for (let j = 1; j < 10; j++) {
          if (this.shouldStop) break; // <<<<<<<<<<<<<< STOP
          const lastSpeed = cycleData[i - 1].speed;
          const speedToSend = ((speed - lastSpeed) / 10) * j + lastSpeed;

          let tempoAtual = Date.now();
          let deltaT = (tempoAtual - tempoAnterior) / 1000;
          let accelerationToSend = (speedToSend / 3.6 - velocidadeAnterior / 3.6) / (deltaT || 1);

          velocidadeAnterior = speedToSend;
          tempoAnterior = tempoAtual;

          await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.CycleCmd', DataType.String, cmd);
          await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.CycleSpeed', DataType.Double, speedToSend);
          await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.CycleAcceleration', DataType.Double, accelerationToSend);
          await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.CycleTotalTime', DataType.Double, totalTime);

          await delay(100);
        }
        totalTime++;
      }

      this.shouldStop = true; // <<<<<< sinaliza interrupção
      await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.CycleCmd', DataType.String, 'cycle-stop');
      await this.wsOpcuaProvider.disconnect();
      console.log('fim do ciclo');
    } else if (cmd === 'cycle_stop') {
      console.log('ciclo interrompido');
      this.shouldStop = true; // <<<<<< sinaliza interrupção
      await this.wsOpcuaProvider.writeTag('ns=4;s=|var|XP340.Application.OPCUA.CycleCmd', DataType.String, cmd);
      await this.wsOpcuaProvider.disconnect();
    }

    return commandReceive;
  }
}

export default CycleService;
