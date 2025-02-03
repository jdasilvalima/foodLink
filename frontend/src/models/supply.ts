export interface Supply {
  id: number;
  number: string;
  name: string;
  unitType: string;
  unitsPerPackage: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export const supplyTypeColors: Record<string, string> = {
  raw_material: 'bg-blue-100 text-blue-800',
  packaging: 'bg-green-100 text-green-800',
  finished_product: 'bg-purple-100 text-purple-800',
};

export const dummySupplies: Supply[] = [
  {
    id: 1,
    number: 'RM001',
    name: 'Wheat Flour',
    unitType: 'bag',
    unitsPerPackage: 25,
    type: 'raw_material',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    number: 'RM002',
    name: 'Sugar',
    unitType: 'bag',
    unitsPerPackage: 50,
    type: 'raw_material',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    number: 'PK001',
    name: 'Cardboard Box',
    unitType: 'piece',
    unitsPerPackage: 100,
    type: 'packaging',
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    number: 'FP001',
    name: 'Chocolate Chip Cookies',
    unitType: 'box',
    unitsPerPackage: 24,
    type: 'finished_product',
    createdAt: '2023-01-04T00:00:00.000Z',
    updatedAt: '2023-01-04T00:00:00.000Z',
  },
];