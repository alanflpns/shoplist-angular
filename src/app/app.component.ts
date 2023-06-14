import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import LocalStorageAdapter from 'src/infra/LocalStorageAdapter';
import {
  moneyInputFormat,
  moneyInputFormatToFloat,
} from 'src/utils/inputMoney';
import productsMock from '../products-mock.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'shop-list-angular';
  productsList: any[] = [];
  totalPrice = 'R$ 0,00';
  range = '';

  ngOnInit() {
    const storage = new LocalStorageAdapter();
    const products = storage.get('@ShopList/products');

    if (products) {
      this.productsList = products.map((product: any) => ({
        ...product,
        quantity:
          typeof product.quantity === 'number'
            ? new FormControl(product.quantity)
            : new FormControl(product.quantity.value),
      }));

      const price =
        products.length > 0
          ? products
            .map((product: any) =>
              product.isChecked
                ? (moneyInputFormatToFloat(product.price) || 0) *
                product.quantity.value
                : 0
            )
            .reduce((a: any, b: any) => a + b)
          : 0;

      this.totalPrice = `R$ ${moneyInputFormat(String(price.toFixed(2)))}`;
    } else {
      storage.set("@ShopList/products", productsMock);
      this.productsList = productsMock.map((product: any) => ({
        ...product,
        quantity:
          typeof product.quantity === 'number'
            ? new FormControl(product.quantity)
            : new FormControl(product.quantity.value),
      }));

      const price =
        productsMock.length > 0
          ? productsMock
            .map((product: any) =>
              product.isChecked
                ? (moneyInputFormatToFloat(product.price) || 0) *
                product.quantity.value
                : 0
            )
            .reduce((a: any, b: any) => a + b)
          : 0;

      this.totalPrice = `R$ ${moneyInputFormat(String(price.toFixed(2)))}`;
    }

    let deferredPrompt: any;
    const containerButton = document.getElementById("container-button");
    const addButton = document.getElementById("add-button");
    const cancelButton = document.getElementById("cancel-button");

    if (containerButton && addButton && cancelButton) {
      containerButton.style.display = "none";

      window.addEventListener("beforeinstallprompt", (e) => {
        console.log("service work on beforeinstallprompt");
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        containerButton.style.display = "flex";

        addButton.addEventListener("click", (e) => {
          // hide our user interface that shows our A2HS button
          containerButton.style.display = "none";
          // Show the prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the prompt");
            } else {
              console.log("User dismissed the prompt");
            }
            deferredPrompt = null;
          });
        });
      });

      cancelButton.addEventListener("click", (e) => {
        containerButton.style.display = "none";
      });
    }
  }

  onUpdateProductsList(newProductsList: any[]): void {
    const newProducts = newProductsList.map((product) => ({
      ...product,
      quantity:
        typeof product.quantity === 'number'
          ? new FormControl(product.quantity)
          : product.quantity,
    }));

    this.productsList = newProducts;
  }

  handleCheckProduct(index: number) {
    const newProductsList = [...this.productsList];
    newProductsList[index].isChecked = !newProductsList[index].isChecked;
    this.productsList = newProductsList;

    const price =
      newProductsList.length > 0
        ? newProductsList
          .map((product: any) =>
            product.isChecked
              ? (moneyInputFormatToFloat(product.price) || 0) *
              product.quantity.value
              : 0
          )
          .reduce((a: any, b: any) => a + b)
        : 0;

    this.totalPrice = `R$ ${moneyInputFormat(String(price.toFixed(2)))}`;

    const storage = new LocalStorageAdapter();
    storage.set('@ShopList/products', newProductsList);
  }

  handleMoreQuantity(index: number, products: any[]) {
    const newProductsList = products;

    newProductsList[index].quantity.setValue(
      newProductsList[index].quantity.value! + 1
    );
    this.productsList = newProductsList;

    const storage = new LocalStorageAdapter();
    storage.set('@ShopList/products', newProductsList);
  }

  handleLessQuantity(index: number, products: any[]) {
    const newProductsList = products;
    if (newProductsList[index].quantity.value > 1) {
      newProductsList[index].quantity.setValue(
        newProductsList[index].quantity.value! - 1
      );
    }
    this.productsList = newProductsList;

    const storage = new LocalStorageAdapter();
    storage.set('@ShopList/products', newProductsList);
  }

  handleChangeQuantity(event: any, index: number, products: any[]) {
    const newValue = event.target.value;
    const newProductsList = products;

    if (newValue) {
      newProductsList[index].quantity.setValue(Number(newValue));
      this.productsList = newProductsList;
    }

    const storage = new LocalStorageAdapter();
    storage.set('@ShopList/products', newProductsList);
  }

  handleChangePrice(e: any, index: number) {
    const newPrice = e.target.value;

    if (newPrice) {
      const newProductsList = [...this.productsList];
      newProductsList[index].price = `R$ ${moneyInputFormat(newPrice)}`;
      this.productsList = newProductsList;

      const storage = new LocalStorageAdapter();
      storage.set('@ShopList/products', newProductsList);
    }
  }

  handleDeleteProduct(index: number) {
    const newProductsList = [...this.productsList];
    newProductsList.splice(index, 1);
    this.productsList = newProductsList;

    const storage = new LocalStorageAdapter();
    storage.set('@ShopList/products', newProductsList);
  }
}
