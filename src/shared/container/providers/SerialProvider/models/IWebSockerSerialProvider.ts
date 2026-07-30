export default interface IWebSocketSerialProvider {
  connect(params: { onConnected: () => void }): Promise<void>;

  disconnect(): Promise<void>;
}
