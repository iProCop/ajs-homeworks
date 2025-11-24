import CountableBuyable from './CountableBuyable';

export default class Smartphone implements CountableBuyable {
    readonly isCountable = true as const;

    constructor(
        readonly id: number,
        readonly name: string,
        readonly price: number,
        readonly brand: string,
        readonly model: string,
        readonly storage: number,
    ) { }
}


