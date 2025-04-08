export interface Fuel {
    id?: string;
    name: string;
    startingPoint: string;
    destination: string;
    distance: number;
    fuelConsumption: number;
    petrolPrice: number;
    totalCost: number;
    createdAt?: any;
    updatedAt?: any;
  }