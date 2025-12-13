import Buyable from '../domain/Buyable';
import CountableBuyable from '../domain/CountableBuyable';

interface CartItem {
    item: Buyable;
    quantity: number;
}

export default class Cart {
    private _items: Map<number, CartItem> = new Map();

    add(item: Buyable): void {
        const existingItem = this._items.get(item.id);
        
        if (existingItem) {
            if ('isCountable' in item && (item as CountableBuyable).isCountable === true) {
                existingItem.quantity += 1;
            }
        } else {
            this._items.set(item.id, { item, quantity: 1 });
        }
    }

    get items(): Buyable[] {
        const result: Buyable[] = [];
        this._items.forEach((cartItem) => {
            for (let i = 0; i < cartItem.quantity; i++) {
                result.push(cartItem.item);
            }
        });
        return result;
    }

    getTotalPrice(): number {
        return Array.from(this._items.values()).reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);
    }

    getTotalPriceWithDiscount(discount: number): number {
        const totalPrice = this.getTotalPrice();
        return totalPrice * (1 - discount / 100);
    }

    removeItemById(id: number): void {
        this._items.delete(id);
    }

    decreaseQuantity(id: number): void {
        const cartItem = this._items.get(id);
        if (cartItem) {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                this._items.delete(id);
            }
        }
    }

    getQuantity(id: number): number {
        const cartItem = this._items.get(id);
        return cartItem ? cartItem.quantity : 0;
    }
}