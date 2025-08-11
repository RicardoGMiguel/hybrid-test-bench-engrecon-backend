import { container } from 'tsyringe';

import WebSocketSerialProvider from './implementations/WebSocketSerialProvider';
import IWebSocketSerialProvider from './models/IWebSockerSerialProvider';

container.registerSingleton<IWebSocketSerialProvider>('WebSocketSerialProvider', WebSocketSerialProvider);
