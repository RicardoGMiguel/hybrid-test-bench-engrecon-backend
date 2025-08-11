import { config } from 'dotenv';

import WebSocketSerialProvider from '../../container/providers/SerialProvider/implementations/WebSocketSerialProvider';

config(); // carrega .env com SERIAL_PATH, SERIAL_BAUD, WS_PORT

const wsSerialProvider = new WebSocketSerialProvider();

wsSerialProvider.onSerialData = data => {
  console.log('Callback externo recebeu:', data);
  // Aqui você poderia salvar no banco ou repassar para outro serviço
};

wsSerialProvider.connect({
  onConnected: () => {
    console.log('Servidor iniciado com sucesso!');
  },
});
