
import { RockType, CalculationResult, OperationCosts } from './types';

const PRICES = {
  dynamite: 25,
  detonator: 5,
  cord: 2
};

export const calculateFace = (width: number, height: number, advance: number, rockType: RockType): CalculationResult => {
  let burden = 0.8;
  let spacing = 0.9;
  let density = 1.2; // kg per meter of hole charged

  if (rockType === RockType.Media) {
    burden = 1.0;
    spacing = 1.1;
    density = 1.5;
  } else if (rockType === RockType.Dura) {
    burden = 1.2;
    spacing = 1.3;
    density = 2.0;
  }

  const area = width * height;
  const holesCount = Math.ceil(area / (burden * spacing) * 1.3); // Safety factor for face
  const totalExplosive = holesCount * advance * 0.8 * density; // Assuming 80% charge length

  const costs = {
    dynamite: totalExplosive * PRICES.dynamite,
    detonator: holesCount * PRICES.detonator,
    cord: holesCount * 2 * PRICES.cord, // Estimated cord length
    total: 0
  };
  costs.total = costs.dynamite + costs.detonator + costs.cord;

  return { spacing, burden, holesCount, totalExplosive, costs };
};

export const calculateBlastingManual = (spacing: number, burden: number, width: number, height: number, advance: number): CalculationResult => {
  const area = width * height;
  const holesCount = Math.ceil(area / (burden * spacing));
  const totalExplosive = holesCount * advance * 0.8 * 1.5; // Fixed generic density

  const costs = {
    dynamite: totalExplosive * PRICES.dynamite,
    detonator: holesCount * PRICES.detonator,
    cord: holesCount * 2 * PRICES.cord,
    total: 0
  };
  costs.total = costs.dynamite + costs.detonator + costs.cord;

  return { spacing, burden, holesCount, totalExplosive, costs };
};

export const calculateOperation = (advance: number, holesCount: number, holeLength: number, pricePerUnit: number): OperationCosts => {
  const volume = advance * 15; // Assumption of standard face size if not provided
  const totalCost = holesCount * holeLength * pricePerUnit;
  
  return {
    volume,
    totalCost,
    costPerHole: totalCost / holesCount,
    costPerMeter: totalCost / (holesCount * holeLength)
  };
};
