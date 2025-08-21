import * as fs from 'fs';
import * as path from 'path';
import { inject, singleton } from 'tsyringe';

import WebSocketSerialProvider from '@shared/container/providers/SerialProvider/implementations/WebSocketSerialProvider';

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
    @inject(WebSocketSerialProvider)
    private wsSerialProvider: WebSocketSerialProvider,
  ) {}

  public async execute({ cmd, cycle }: IRequest): Promise<string> {
    const commandReceive = JSON.stringify({ cmd, cycle });

    function delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    await this.wsSerialProvider.disconnect();

    await this.wsSerialProvider.connect({
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

          const command = JSON.stringify({ cmd, speed: speedToSend, acceleration: accelerationToSend, totalTime });
          console.log('foi enviado o comando:', command);

          await this.wsSerialProvider.sendSerialData(command);
          await delay(100);
        }
        totalTime++;
      }
    } else if (cmd === 'cycle_stop') {
      console.log('ciclo interrompido');
      this.shouldStop = true; // <<<<<< sinaliza interrupção
      await this.wsSerialProvider.disconnect();

      const command = JSON.stringify({ cmd });
      await this.wsSerialProvider.sendSerialData(command);
    }

    return commandReceive;
  }
}

export default CycleService;
