export default interface IWebSocketSerialProvider {
  connect(params: { onConnected: () => void }): void;
}
