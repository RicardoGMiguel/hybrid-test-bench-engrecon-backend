export interface IReport {
  id: string;
  time: number;
  cardanSpeed: number;
  motorSpeed: number;
  currentStepperMotorState: number;
  created_at: Date;
  updated_at: Date;
}
