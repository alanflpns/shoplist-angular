import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import LocalStorageAdapter from 'src/infra/LocalStorageAdapter';

interface Product {
  name: string;
  quantity: any;
  isChecked: boolean;
  price: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Input() productsList: Product[] = [];
  @Output() updateProductsList = new EventEmitter();
  nameProduct = new FormControl('');
  quantity = new FormControl(1);

  handleMoreQuantity(this: any): void {
    this.quantity.setValue(this.quantity?.value + 1);
  }

  handleLessQuantity(): void {
    if (this.quantity.value && this.quantity.value > 1) {
      this.quantity.setValue(this.quantity?.value - 1);
    }
  }

  submitForm(): void {
    const product = {
      name: this.nameProduct.value,
      quantity: this.quantity.value,
      isChecked: false,
      price: 'R$ 0,00',
    };

    const currentProduct = this.productsList.find(
      (product) => product.name === this.nameProduct.value
    );

    if (currentProduct) {
      const productIndex = this.productsList.findIndex(
        (product: any) => product.name === this.nameProduct.value
      );

      const newProductsList = [...this.productsList];

      (newProductsList[productIndex].quantity as any)?.setValue(
        this.quantity.value! + currentProduct.quantity.value
      );
      this.updateProductsList.emit(newProductsList);
    } else {
      this.updateProductsList.emit([...this.productsList, product]);
    }

    this.nameProduct.setValue('');
    this.quantity.setValue(1);

    const storage = new LocalStorageAdapter();
    storage.set('@ShopList/products', [...this.productsList, product]);
  }
}
