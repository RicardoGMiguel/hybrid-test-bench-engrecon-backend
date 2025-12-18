export interface IReport {
  id: string;
  time: number;
  cardanSpeed: number;
  motorSpeed: number;
  currentStepperMotorState: number;
  commandCouplingInstant: number;
  created_at: Date;
  updated_at: Date;
}
