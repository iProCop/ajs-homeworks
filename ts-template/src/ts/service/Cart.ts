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
            // Если товар счетный, увеличиваем количество
            if ('isCountable' in item && (item as CountableBuyable).isCountable === true) {
                existingItem.quantity += 1;
            }
            // Если товар не счетный, не делаем ничего (он уже в корзине)
        } else {
            // Добавляем новый товар с количеством 1
            this._items.set(item.id, { item, quantity: 1 });
        }
    }

    get items(): Buyable[] {
        const result: Buyable[] = [];
        this._items.forEach((cartItem) => {
            // Для каждого товара добавляем его quantity раз
            for (let i = 0; i < cartItem.quantity; i++) {
                result.push(cartItem.item);
            }
        });
        return result;
    }

    getTotalPrice(): number {
        let total = 0;
        this._items.forEach((cartItem) => {
            total += cartItem.item.price * cartItem.quantity;
        });
        return total;
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
                // Если количество становится 0, удаляем товар из корзины
                this._items.delete(id);
            }
        }
    }

    getQuantity(id: number): number {
        const cartItem = this._items.get(id);
        return cartItem ? cartItem.quantity : 0;
    }
}