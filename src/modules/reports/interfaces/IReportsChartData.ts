export interface ISpeedChart {
  time: number;
  cardanSpeed: number;
  motorSpeed: number;
}

export interface IDiffSpeedChart {
  time: number;
  diffSpeedBetweenShafts: number;
}

export interface ICouplingInfo {
  couplingCommandInstant: number;
  couplingInstant: number;
}

export interface IReportsChartData {
  speedChartData: ISpeedChart[];
  diffSpeedChart: IDiffSpeedChart[];
  couplingInfo: ICouplingInfo;
}
