import {
  AttributeIds,
  ClientMonitoredItem,
  ClientSession,
  ClientSubscription,
  DataType,
  OPCUAClient,
  TimestampsToReturn,
} from 'node-opcua';
import { inject, singleton } from 'tsyringe';
import WebSocket, { WebSocketServer } from 'ws';

import ICreateReportDTO from '@modules/reports/dtos/ICreateReportDTO';
import IReportsRepository from '@modules/reports/repositories/IReportsRepository';

import { IConnectDTO } from '../dtos/IConnectDTO';
import IWebSocketSerialProvider from '../models/IWebSockerSerialProvider';

@singleton()
class WebSocketOPCUAProvider implements IWebSocketSerialProvider {
  constructor(
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,
  ) {}

  private client: OPCUAClient | null = null;

  private session: ClientSession | null = null;

  private subscription: ClientSubscription | null = null;

  private wss: WebSocketServer | null = null;

  public onOPCUAData?: (data: string) => void;

  public onMessageFromPython?: (data: string) => void;

  private state = {
    message: '',
    state: {
      timeCounter: 0,
      cardanSpeed: 0,
      motorSpeed: 0,
      motorState: false,
      regenerationState: false,
      vehicleSpeed: 0,
      vehicleAcceleration: 0,
      sensorsDelay: 0,
      couplingInstant: 0,
      actuatorState: false,
      totalTime: 0,
    },
  };

  private async openOPCUAConnection(): Promise<void> {
    if (this.session) {
      return;
    }

    const endpoint = process.env.OPCUA_ENDPOINT || 'opc.tcp://127.0.0.1:62640/UA/MyServer';

    console.log(`🔌 Conectando OPC-UA: ${endpoint}`);

    this.client = OPCUAClient.create({
      endpointMustExist: false,
    });

    await this.client.connect(endpoint);

    this.session = await this.client.createSession();

    console.log('✔ Sessão OPC-UA criada');
  }

  private async monitorTag(nodeId: string, callback: (value: any) => void): Promise<void> {
    if (!this.subscription) {
      throw new Error('Subscription OPC-UA não criada');
    }

    const monitoredItem = ClientMonitoredItem.create(
      this.subscription,
      {
        nodeId,
        attributeId: AttributeIds.Value,
      },
      {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 10,
      },
      TimestampsToReturn.Both,
    );

    monitoredItem.on('changed', dataValue => {
      callback(dataValue.value.value);
    });
  }

  private processState(): void {
    const payload = JSON.stringify({
      state: this.state,
    });

    if (this.onOPCUAData) {
      this.onOPCUAData(payload);
    }

    console.log(payload);

    this.broadcast(payload);

    try {
      const newReport: ICreateReportDTO = {
        time: Number(this.state.state.timeCounter) || 0,
        cardanSpeed: Number(this.state.state.cardanSpeed) || 0,
        motorSpeed: Number(this.state.state.motorSpeed) || 0,
        actuatorState: this.state.state.actuatorState ? 1 : 0,
        commandCouplingInstant: Number(this.state.state.couplingInstant) || 0,
      };

      this.reportsRepository.create(newReport);
    } catch (error) {
      console.log('Erro ao criar relatório:', error);
    }
  }

  public async connect({ onConnected }: IConnectDTO): Promise<void> {
    this.reportsRepository.deleteAll();

    await this.openOPCUAConnection();

    const wsPort = Number(process.env.WS_PORT) || 8080;

    this.wss = new WebSocketServer({
      port: wsPort,
    });

    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('Cliente conectado via WebSocket');

      if (req.url === '/python') {
        console.log('🔹 Conexão Python detectada');

        ws.on('ping', () => {
          ws.pong();
        });

        ws.on('message', (msg: WebSocket.RawData) => {
          const message = msg.toString();

          if (this.onMessageFromPython) {
            this.onMessageFromPython(message);
          }
        });
      }

      ws.on('close', () => console.log('Cliente desconectado'));
    });

    this.subscription = ClientSubscription.create(this.session!, {
      requestedPublishingInterval: 100,
      requestedLifetimeCount: 100,
      requestedMaxKeepAliveCount: 10,
      maxNotificationsPerPublish: 100,
      publishingEnabled: true,
      priority: 1,
    });

    console.log('✔ Subscription OPC-UA criada');

    // ==========================
    // Tags do PLC Leitura
    // ==========================

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.Message', value => {
      this.state.message = String(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.TimeCounter', value => {
      this.state.state.timeCounter = Number(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.CycleTotalTime', value => {
      this.state.state.totalTime = Number(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.CycleTotalTime', value => {
      this.state.state.totalTime = Number(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.CurrentCardanSpeed', value => {
      this.state.state.cardanSpeed = Number(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.CurrentMotorSpeed', value => {
      this.state.state.motorSpeed = Number(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.SensorsDelay', value => {
      this.state.state.sensorsDelay = Number(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.TestCouplingInstant', value => {
      this.state.state.couplingInstant = Number(value);

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.ActuatorState', value => {
      this.state.state.actuatorState = value;

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.MotorState', value => {
      this.state.state.motorState = value;

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.RegenerationState', value => {
      this.state.state.regenerationState = value;

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.CycleSpeed', value => {
      this.state.state.vehicleSpeed = Number(value.toFixed(0));

      this.processState();
    });

    await this.monitorTag('ns=4;s=|var|XP340.Application.OPCUA.CycleAcceleration', value => {
      this.state.state.vehicleAcceleration = Number(value.toFixed(0));

      this.processState();
    });

    console.log(`✔✔ WebSocket rodando na porta ${wsPort}`);

    onConnected();
  }

  private broadcast(message: string): void {
    if (!this.wss) {
      return;
    }

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public async disconnect(): Promise<void> {
    if (this.subscription) {
      await this.subscription.terminate();
      this.subscription = null;
    }

    if (this.session) {
      await this.session.close();
      this.session = null;
    }

    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }

    if (this.wss) {
      this.wss.clients.forEach(client => client.close());

      this.wss.close(() => {
        console.log('🔌 WebSocket Server fechado.');
      });

      this.wss = null;
    }

    this.onOPCUAData = undefined;

    console.log('✔✔ Conexões encerradas com sucesso.');
  }

  public async writeTag(nodeId: string, dataType: DataType, value: number | string): Promise<void> {
    if (!this.session) {
      // throw new Error('Sessão OPC-UA não disponível');
      console.log('Sessão OPC-UA não disponível');
      return;
    }

    await this.session.write({
      nodeId,
      attributeId: AttributeIds.Value,
      value: {
        value: {
          dataType: dataType,
          value,
        },
      },
    });
  }
}

export default WebSocketOPCUAProvider;
