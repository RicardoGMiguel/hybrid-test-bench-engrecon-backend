import { ReadlineParser, SerialPort } from 'serialport';
import { injectable } from 'tsyringe';
import WebSocket, { WebSocketServer } from 'ws';

import { IConnectDTO } from '../dtos/IConnectDTO';
import IWebSocketSerialProvider from '../models/IWebSockerSerialProvider';

@injectable()
class WebSocketSerialProvider implements IWebSocketSerialProvider {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private wss: WebSocketServer | null = null;

  public onSerialData?: (data: string) => void;

  public async connect({ onConnected }: IConnectDTO): Promise<void> {
    if (this.port) throw new Error('Serial already connected');

    const baudRate = Number(process.env.SERIAL_BAUD) || 115200;
    const wsPort = Number(process.env.WS_PORT) || 8080;

    // Detecta automaticamente a porta
    const ports = await SerialPort.list();
    if (ports.length === 0) {
      throw new Error('Nenhum dispositivo serial encontrado.');
    }

    // Escolhe a primeira porta encontrada (poderia filtrar por fabricante)
    const chosenPort = ports[0].path;
    console.log(`🔌 Conectando na porta: ${chosenPort}`);

    // Conecta à porta serial
    this.port = new SerialPort({ path: chosenPort, baudRate });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    // Servidor WebSocket
    this.wss = new WebSocketServer({ port: wsPort });
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Cliente conectado via WebSocket');
      ws.on('close', () => console.log('Cliente desconectado'));
    });

    // Dados recebidos da serial
    this.parser.on('data', (data: string) => {
      const trimmed = data.trim();
      console.log('Dado da serial:', trimmed);

      if (this.onSerialData) {
        this.onSerialData(trimmed);
      }

      this.broadcast(trimmed);
    });

    console.log(`✔✔ WebSocket rodando na porta ${wsPort}`);
    console.log(`✔✔ Serial conectada em ${chosenPort} @ ${baudRate}bps`);
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
}

export default WebSocketSerialProvider;
