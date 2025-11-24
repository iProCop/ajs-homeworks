import Cart from '../service/Cart';
import Book from '../domain/Book';
import MusicAlbum from '../domain/MusicAlbum';
import Movie from '../domain/Movie';
import Smartphone from '../domain/Smartphone';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  test('new cart should be empty', () => {
    expect(cart.items.length).toBe(0);
  });

  test('should add items to cart', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    const album = new MusicAlbum(1008, 'Meteora', 'Linkin Park', 900);

    cart.add(book);
    cart.add(album);

    expect(cart.items.length).toBe(2);
    expect(cart.items).toContain(book);
    expect(cart.items).toContain(album);
  });

  test('should return copy of items array', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    cart.add(book);

    const items1 = cart.items;
    const items2 = cart.items;

    expect(items1).not.toBe(items2);
    expect(items1).toEqual(items2);
  });

  test('should calculate total price without discount', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    const album = new MusicAlbum(1008, 'Meteora', 'Linkin Park', 900);
    const movie = new Movie(1010, 'The Avengers', 2012, 2012, 'USA', 'Avengers Assemble!', 'action, sci-fi', 143);

    cart.add(book);
    cart.add(album);
    cart.add(movie);

    const totalPrice = cart.getTotalPrice();
    expect(totalPrice).toBe(2000 + 900 + 2012);
  });

  test('should return 0 for empty cart total price', () => {
    const totalPrice = cart.getTotalPrice();
    expect(totalPrice).toBe(0);
  });

  test('should calculate total price with discount', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    const album = new MusicAlbum(1008, 'Meteora', 'Linkin Park', 900);

    cart.add(book);
    cart.add(album);

    const totalPrice = 2000 + 900; // 2900
    const discount = 10; // 10%
    const expectedPrice = totalPrice * (1 - discount / 100); // 2900 * 0.9 = 2610

    const priceWithDiscount = cart.getTotalPriceWithDiscount(discount);
    expect(priceWithDiscount).toBe(expectedPrice);
  });

  test('should calculate total price with 0% discount', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    cart.add(book);

    const priceWithDiscount = cart.getTotalPriceWithDiscount(0);
    expect(priceWithDiscount).toBe(2000);
  });

  test('should calculate total price with 100% discount', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    cart.add(book);

    const priceWithDiscount = cart.getTotalPriceWithDiscount(100);
    expect(priceWithDiscount).toBe(0);
  });

  test('should remove item by id', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    const album = new MusicAlbum(1008, 'Meteora', 'Linkin Park', 900);
    const movie = new Movie(1010, 'The Avengers', 2012, 2012, 'USA', 'Avengers Assemble!', 'action, sci-fi', 143);

    cart.add(book);
    cart.add(album);
    cart.add(movie);

    expect(cart.items.length).toBe(3);

    cart.removeItemById(1008);

    expect(cart.items.length).toBe(2);
    expect(cart.items).toContain(book);
    expect(cart.items).not.toContain(album);
    expect(cart.items).toContain(movie);
  });

  test('should not remove item if id does not exist', () => {
    const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
    cart.add(book);

    expect(cart.items.length).toBe(1);

    cart.removeItemById(9999);

    expect(cart.items.length).toBe(1);
    expect(cart.items).toContain(book);
  });

  test('should remove item from empty cart without error', () => {
    expect(cart.items.length).toBe(0);
    cart.removeItemById(1001);
    expect(cart.items.length).toBe(0);
  });

  test('should work with Movie class', () => {
    const movie = new Movie(1010, 'The Avengers', 2012, 2012, 'USA', 'Avengers Assemble!', 'action, sci-fi', 143);
    cart.add(movie);

    expect(cart.items.length).toBe(1);
    expect(cart.items[0]).toBe(movie);
    expect(cart.getTotalPrice()).toBe(2012);
  });

  describe('Countable items', () => {
    test('should increase quantity when adding countable item multiple times', () => {
      const smartphone = new Smartphone(2001, 'iPhone 15', 79999, 'Apple', 'iPhone 15', 128);

      cart.add(smartphone);
      expect(cart.getQuantity(2001)).toBe(1);
      expect(cart.items.length).toBe(1);

      cart.add(smartphone);
      expect(cart.getQuantity(2001)).toBe(2);
      expect(cart.items.length).toBe(2);

      cart.add(smartphone);
      expect(cart.getQuantity(2001)).toBe(3);
      expect(cart.items.length).toBe(3);
    });

    test('should not duplicate non-countable items when adding multiple times', () => {
      const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);

      cart.add(book);
      expect(cart.getQuantity(1001)).toBe(1);
      expect(cart.items.length).toBe(1);

      cart.add(book);
      expect(cart.getQuantity(1001)).toBe(1);
      expect(cart.items.length).toBe(1);

      cart.add(book);
      expect(cart.getQuantity(1001)).toBe(1);
      expect(cart.items.length).toBe(1);
    });

    test('should calculate total price correctly for countable items', () => {
      const smartphone = new Smartphone(2001, 'iPhone 15', 79999, 'Apple', 'iPhone 15', 128);

      cart.add(smartphone);
      cart.add(smartphone);
      cart.add(smartphone);

      expect(cart.getTotalPrice()).toBe(79999 * 3);
    });

    test('should decrease quantity of countable item', () => {
      const smartphone = new Smartphone(2001, 'iPhone 15', 79999, 'Apple', 'iPhone 15', 128);

      cart.add(smartphone);
      cart.add(smartphone);
      cart.add(smartphone);

      expect(cart.getQuantity(2001)).toBe(3);
      expect(cart.items.length).toBe(3);

      cart.decreaseQuantity(2001);
      expect(cart.getQuantity(2001)).toBe(2);
      expect(cart.items.length).toBe(2);

      cart.decreaseQuantity(2001);
      expect(cart.getQuantity(2001)).toBe(1);
      expect(cart.items.length).toBe(1);
    });

    test('should remove item when quantity decreases to 0', () => {
      const smartphone = new Smartphone(2001, 'iPhone 15', 79999, 'Apple', 'iPhone 15', 128);

      cart.add(smartphone);
      expect(cart.getQuantity(2001)).toBe(1);

      cart.decreaseQuantity(2001);
      expect(cart.getQuantity(2001)).toBe(0);
      expect(cart.items.length).toBe(0);
    });

    test('should return 0 quantity for non-existent item', () => {
      expect(cart.getQuantity(9999)).toBe(0);
    });

    test('should not decrease quantity for non-existent item', () => {
      cart.decreaseQuantity(9999);
      expect(cart.items.length).toBe(0);
    });

    test('should work with mixed countable and non-countable items', () => {
      const book = new Book(1001, 'War and Piece', 'Leo Tolstoy', 2000, 1225);
      const smartphone = new Smartphone(2001, 'iPhone 15', 79999, 'Apple', 'iPhone 15', 128);

      cart.add(book);
      cart.add(smartphone);
      cart.add(smartphone);
      cart.add(book); // Should not duplicate

      expect(cart.getQuantity(1001)).toBe(1);
      expect(cart.getQuantity(2001)).toBe(2);
      expect(cart.items.length).toBe(3); // 1 book + 2 smartphones
      expect(cart.getTotalPrice()).toBe(2000 + 79999 * 2);
    });

    test('should calculate discount correctly for countable items', () => {
      const smartphone = new Smartphone(2001, 'iPhone 15', 10000, 'Apple', 'iPhone 15', 128);

      cart.add(smartphone);
      cart.add(smartphone);
      cart.add(smartphone);

      const totalPrice = 10000 * 3; // 30000
      const discount = 10; // 10%
      const expectedPrice = totalPrice * (1 - discount / 100); // 30000 * 0.9 = 27000

      const priceWithDiscount = cart.getTotalPriceWithDiscount(discount);
      expect(priceWithDiscount).toBe(expectedPrice);
    });
  });
});
