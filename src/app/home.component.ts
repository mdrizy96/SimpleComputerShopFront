import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {ShopService} from './core/services/shop.service';
import {LocalStorageService} from './core/services/local-storage.service';
import {finalize} from 'rxjs/operators';
import {CartLaptop, ICartItem, ICartLaptop, IConfigurationCost, ILaptopBrand, ILaptopConfigurationItem} from './core/models/shop.model';
import {CartService} from './core/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  laptopForm!: FormGroup;
  error = '';

  laptopBrandList!: ILaptopBrand[];
  laptopConfigItemList!: ILaptopConfigurationItem[];

  submitted = false;
  showLaptopConfigItems = false;

  // This array will hold selected config items
  configCosts: any[] = [];

  // This will hold the total cost of the laptop
  totalLaptopCost = 0;

  constructor(public fb: FormBuilder, private router: Router, private spinner: NgxSpinnerService,
              private shopService: ShopService, private localStore: LocalStorageService,
              private cartService: CartService) {
  }

  get brandId(): FormControl {
    return this.laptopForm.get('brandId') as FormControl;
  }

  get brandName(): FormControl {
    return this.laptopForm.get('brandName') as FormControl;
  }

  get brandCost(): FormControl {
    return this.laptopForm.get('brandCost') as FormControl;
  }

  get configItems(): FormArray {
    return this.laptopForm.get('configItems') as FormArray;
  }

  ngOnInit(): void {
    this.laptopForm = this.fb.group({
      brandId: [null, {validators: [Validators.required]}],
      brandName: [null, {validators: [Validators.required]}],
      brandCost: [null, {validators: [Validators.required]}],
      configItems: this.fb.array([])
    });

    this.retrieveAllLaptopBrands();
    this.retrieveLaptopConfigurationItems();
  }

  addLaptopConfigItems(): void {
    this.laptopConfigItemList.map(item => {
      this.configItems.push(
        this.fb.group({
          configurationItemId: [item.configurationItemId, {validators: [Validators.required]}],
          itemName: [item.itemName, {validators: [Validators.required]}],
          checked: [item.checked || false, {validators: [Validators.required]}],
          configChoices: this.fb.array([])
        })
      );
    });
  }

  addFormItem(configurationItemId: number): FormGroup {
    return this.fb.group({
      configurationItemId: [configurationItemId, {validators: [Validators.required]}],
      configurationCostId: [null, {validators: [Validators.required]}]
    });
  }

  retrieveAllLaptopBrands(): any {
    this.spinner.show();
    this.shopService.getAllLaptopBrands()
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        (response: any) => {
          this.laptopBrandList = response;
        },
        (error: string) => {
          this.error = error;
        }
      );
  }

  retrieveLaptopConfigurationItems(): any {
    this.spinner.show();
    this.shopService.getLaptopConfigurationItems()
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        (response: any) => {
          this.laptopConfigItemList = response;

          this.initializeLaptopConfigCosts();
        },
        (error: string) => {
          this.error = error;
        }
      );
  }

  initializeLaptopConfigCosts(): void{
    // Initialize config costs array to null values
    this.configCosts = [];
    for (let i = 0; i < this.laptopConfigItemList.length; i++) {
      this.configCosts.push(null);
    }
  }

  retrieveConfigurationCostsOfItem(configurationItemId: number, configItem: AbstractControl): any {
    this.spinner.show();
    this.shopService.getConfigurationCostsOfItem(configurationItemId)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(
        (response: any) => {
          const configurationCosts = response as IConfigurationCost[];
          const configChoices = configItem.get('configChoices') as FormArray;
          configurationCosts.map((costItem: IConfigurationCost) => {
            configChoices.push(
              this.fb.group({
                configurationItemId: [costItem.configurationItemId, {validators: [Validators.required]}],
                option: [costItem.option, {validators: [Validators.required]}],
                cost: [costItem.cost || false, {validators: [Validators.required]}],
                checked: [costItem.checked || false, {validators: [Validators.required]}]
              })
            );
          });
          return configurationCosts;
        },
        (error: string) => {
          this.error = error;
          return [];
        }
      );
  }

  addLaptopToCart(): any {
    // Create cart item - [{Brand name, brand cost, config choices(configName, configChoice, cost), total cost]
    const cartLaptop = new CartLaptop();
    cartLaptop.brandCost = this.brandCost.value;
    cartLaptop.brandName = this.brandName.value;
    cartLaptop.totalCost = this.totalLaptopCost;

    this.configCosts.map((costItem, index) => {
      if (costItem){
        const itemCost = costItem as IConfigurationCost;
        const laptopConfigItem = this.configItems.controls[index].get('itemName')?.value;
        const cartItem = {
          configName: laptopConfigItem,
          configChoice: itemCost.option,
          cost: itemCost.cost
        } as ICartItem;
        cartLaptop.config.push(cartItem);
      }
    });

    // Store cart item in local storage - shop-cart-items array
    let cartLaptops: ICartLaptop[] = [];
    const storedCart = this.localStore.getItem('shop-cart-items');
    if (storedCart){
      cartLaptops = JSON.parse(storedCart) as CartLaptop[];
      cartLaptops.push(cartLaptop as ICartLaptop);
      this.localStore.store('shop-cart-items', cartLaptops);
    } else {
      // Create cart store and store laptop
      cartLaptops.push(cartLaptop as ICartLaptop);
      this.localStore.store('shop-cart-items', cartLaptops);
    }
    this.toggleCartUpdate();
    this.resetShoppingForm();
  }

  resetShoppingForm(): void{
    this.laptopForm.reset();
    this.configItems.clear();
    this.totalLaptopCost = 0;
  }

  handleBrandChange(): void {
    this.configItems.clear();
    this.initializeLaptopConfigCosts();
    this.totalLaptopCost = 0;

    if (!this.brandId.value) {
      return;
    }

    // Show configuration options
    this.showLaptopConfigItems = true;

    // Get the selected brand name and set as brand name in the form
    const brand = this.laptopBrandList.filter(x => x.brandId === this.brandId.value)[0];
    this.brandName.setValue(brand.brandName);
    this.brandCost.setValue(brand.cost);

    // Add config items to form
    this.addLaptopConfigItems();

    // Calculate cost
    this.calculateTotalCostOfLaptop();
  }

  onConfigItemCheckChange(configItemIndex: number): any {
    const configItem = this.configItems.controls[configItemIndex];
    const configItemChecked = configItem.get('checked')?.value;
    if (configItemChecked){
      // Get configuration costs of the selected item and add under it for selection
      const configurationCosts = this.retrieveConfigurationCostsOfItem(configItem.value?.configurationItemId, configItem);
    }
    else {
      // Clear configuration items of this item
      const configChoices = this.configChoiceArray(configItemIndex);
      configChoices.clear();

      // Set config cost to null
      this.configCosts[configItemIndex] = null;
    }

    // Calculate cost
    this.calculateTotalCostOfLaptop();
  }

  configChoiceArray(configItemIndex: number): FormArray {
    const configItem = this.configItems.controls[configItemIndex];
    return configItem.get('configChoices') as FormArray;
  }

  handleConfigChoiceChange(configItemIndex: number, configChoiceIndex: number, configChoice: AbstractControl): void {
    this.configCosts[configItemIndex] = configChoice.value as IConfigurationCost;
    // Calculate cost
    this.calculateTotalCostOfLaptop();
  }

  calculateTotalCostOfLaptop(): void{
    // Reset total cost
    this.totalLaptopCost = 0;

    // Proceed only if brand name is selected
    if (this.brandId.value){
      // Add cost of brand
      this.totalLaptopCost += Number(this.brandCost.value);

      // Add config item costs
      this.configCosts.map(costItem => {
        if (costItem){
          const item = costItem as IConfigurationCost;
          this.totalLaptopCost += Number(item.cost);
        }
      });
    }
  }

  get isCartUpdated(): boolean {
    return this.cartService.isCartUpdated;
  }

  toggleCartUpdate(): void {
    this.cartService.toggleCartUpdate();
  }
}
