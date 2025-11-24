import Buyable from './Buyable';

export default interface CountableBuyable extends Buyable {
    readonly isCountable: true;
}


