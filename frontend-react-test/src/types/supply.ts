export type UnitType = "cs" | "bag" | "lbs";

export interface Supply {
  id: string
  number: string
  name: string
  unitType: UnitType
  unitsPerPackage: number
}
