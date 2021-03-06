export interface ILaptopBrand {
  brandId: number;
  brandName: string;
  cost: number;
}

export interface ILaptopConfigurationItem {
  configurationItemId: number;
  itemName: string;
}

export interface IConfigurationCost {
  configurationCostId: number;
  configurationItemId: number;
  option: string;
  cost: number;
}
