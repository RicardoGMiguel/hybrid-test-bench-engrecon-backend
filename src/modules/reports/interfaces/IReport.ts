export interface IReport {
  id: string;
  time: number;
  cardanSpeed: number;
  motorSpeed: number;
  actuatorState: number;
  commandCouplingInstant: number;
  created_at: Date;
  updated_at: Date;
}
