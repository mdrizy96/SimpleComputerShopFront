export interface ILaptopBrand {
  brandId: number;
  brandName: string;
  cost: number;
}

export interface ILaptopConfigurationItem {
  configurationItemId: number;
  itemName: string;
  checked?: boolean;
}

export interface IConfigurationCost {
  configurationCostId: number;
  configurationItemId: number;
  option: string;
  cost: number;
  checked?: boolean;
}

export interface ICartLaptop {
  brandName: string;
  brandCost: number;
  config: ICartItem[];
  totalCost: number;
}

export interface ICartItem{
  configName: string;
  configChoice: string;
  cost: number;
}

export class CartLaptop implements ICartLaptop{
  brandCost = 0;
  brandName = '';
  config: ICartItem[] = [];
  totalCost = 0;
}
