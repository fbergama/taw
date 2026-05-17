import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my first angular application';

  private idgen = (function() {
    /**
     * A simple function to generate unique ids
     */
    let i = 0;
    return function() { return i++; }
  })();

  products: {id: number, name: string}[] = [];

  num_products(): number {
    return this.products.length;
  }

  get_products()  {
    return this.products;
  }

  add_product( p: string ) {
    this.products.push( {id: this.idgen(), name: p } );
  }

  delete_product( id: number ) {
    for ( let i = 0; i < this.products.length; ++i ) {
      if ( this.products[i].id === id ) {
        this.products.splice(i, 1);
        return;
      }
    }
  }

}
