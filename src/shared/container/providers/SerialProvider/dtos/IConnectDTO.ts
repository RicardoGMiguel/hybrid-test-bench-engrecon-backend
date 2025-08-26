export interface IConnectDTO {
  onConnected: () => void;
  onMessageFromPython?: (data: string) => void;
}
