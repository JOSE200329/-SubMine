
export enum RockType {
  Blanda = 'Blanda',
  Media = 'Media',
  Dura = 'Dura'
}

export interface CalculationResult {
  spacing: number;
  burden: number;
  holesCount: number;
  totalExplosive: number;
  costs: {
    dynamite: number;
    detonator: number;
    cord: number;
    total: number;
  };
}

export interface OperationCosts {
  volume: number;
  totalCost: number;
  costPerHole: number;
  costPerMeter: number;
}
