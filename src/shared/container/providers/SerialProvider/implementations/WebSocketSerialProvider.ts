import { ReadlineParser, SerialPort } from 'serialport';
import { inject, singleton } from 'tsyringe';
import WebSocket, { WebSocketServer } from 'ws';

import ICreateReportDTO from '@modules/reports/dtos/ICreateReportDTO';
import IReportsRepository from '@modules/reports/repositories/IReportsRepository';

import { IConnectDTO } from '../dtos/IConnectDTO';
import IWebSocketSerialProvider from '../models/IWebSockerSerialProvider';

@singleton()
class WebSocketSerialProvider implements IWebSocketSerialProvider {
  constructor(
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,
  ) {}

  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private wss: WebSocketServer | null = null;

  public onSerialData?: (data: string) => void;
  public onMessageFromPython?: (data: string) => void;

  private async openSerialPort(): Promise<void> {
    if (this.port && this.port.isOpen) return; // já aberta

    const baudRate = Number(process.env.SERIAL_BAUD) || 115200;
    const ports = await SerialPort.list();
    if (ports.length === 0) throw new Error('Nenhum dispositivo serial encontrado.');

    const chosenPort = ports[0].path;
    console.log(`🔌 Abrindo porta serial: ${chosenPort}`);

    await new Promise<void>((resolve, reject) => {
      this.port = new SerialPort({ path: chosenPort, baudRate }, err => {
        if (err) {
          return reject(err);
        }
      });

      this.port.once('open', () => {
        console.log(`✔ Porta serial aberta em ${chosenPort} @ ${baudRate}bps`);
        resolve();
      });

      this.port.once('error', reject);
    });
  }

  public async connect({ onConnected }: IConnectDTO): Promise<void> {
    //limpar os dados do relatório ao conectar
    this.reportsRepository.deleteAll();

    // Abre a porta serial (reutilizando o método)
    await this.openSerialPort();

    const wsPort = Number(process.env.WS_PORT) || 8080;

    // Garante que o parser está configurado
    this.parser = this.port!.pipe(new ReadlineParser({ delimiter: '\n' }));

    // Servidor WebSocket
    this.wss = new WebSocketServer({ port: wsPort });
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('Cliente conectado via WebSocket');

      if (req.url === '/python') {
        console.log('🔹 Conexão Python detectada');

        // Envia pong automaticamente se receber ping
        ws.on('ping', () => {
          ws.pong();
        });

        ws.on('message', (msg: WebSocket.RawData) => {
          const message = msg.toString();
          // console.log('Python → Node.js:', message);

          if (this.onMessageFromPython) {
            this.onMessageFromPython(message);
          }
        });
      }

      ws.on('close', () => console.log('Cliente desconectado'));
    });

    // Dados recebidos da serial
    this.parser.on('data', (data: string) => {
      const trimmed = data.trim();

      if (this.onSerialData) {
        this.onSerialData(trimmed);
      }

      this.broadcast(trimmed);

      try {
        const newData = JSON.parse(trimmed);

        const newReport: ICreateReportDTO = {
          time: Number(newData?.state.time) || 0,
          cardanSpeed: Number(newData?.state.cardanSpeed) || 0,
          motorSpeed: Number(newData?.state.motorSpeed) || 0,
          currentStepperMotorState: Number(newData?.state.stepperMotorState) || 0,
        };

        // console.log('newReport:', newReport);
        this.reportsRepository.create(newReport);
      } catch (e) {
        console.log('erro', e);
      }
    });

    console.log(`✔✔ WebSocket rodando na porta ${wsPort}`);
    onConnected();
  }

  private broadcast(message: string): void {
    if (!this.wss) return;

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public async disconnect(): Promise<void> {
    // Fecha parser antes da porta
    if (this.parser) {
      if (this.port) {
        this.port.unpipe(this.parser);
      }
      this.parser.removeAllListeners();
      this.parser.destroy(); // 🔹 garante destruição
      this.parser = null;
    }

    // Fecha a porta serial
    if (this.port) {
      await new Promise<void>((resolve, reject) => {
        this.port!.close(err => {
          if (err) {
            console.error('Erro ao fechar porta serial:', err);
            return reject(err);
          }
          console.log('🔌 Porta serial fechada.');
          resolve();
        });
      });
      this.port.removeAllListeners();
      this.port = null;
      await new Promise(res => setTimeout(res, 300)); // 🔹 tempo para Windows
    }

    // Fecha WebSocket Server
    if (this.wss) {
      this.wss.clients.forEach(client => client.close());
      this.wss.close(() => {
        console.log('🔌 WebSocket Server fechado.');
      });
      this.wss = null;
    }

    // Remove callbacks
    this.onSerialData = undefined;

    console.log('✔✔ Conexões encerradas com sucesso.');
  }

  public async sendSerialData(message: string): Promise<void> {
    // Garante que a porta esteja aberta antes de enviar
    if (!this.port || !this.port.isOpen) {
      await this.openSerialPort();
    }

    this.port!.write(message.endsWith('\n') ? message : message + '\n', err => {
      if (err) {
        console.error('Erro ao enviar para serial:', err.message);
      } else {
        console.log(`Enviado para serial: ${message}`);
      }
    });
  }
}

export default WebSocketSerialProvider;
