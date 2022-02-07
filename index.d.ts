declare namespace BankersMath {
	export const NA: string
	export const E: number
	export const DIFFRA_PROPORT: string
	export const DIFFRA_PAYOFF: string

	export const enum NormalisationMethod {
		NA = 'NA',
		DIFFRA_PROPORT = 'Proportionality',
		DIFFRA_PAYOFF = 'Payoff'
	}

	export type DiffractionTemp = {
		percent: number
		min: number
		max: number
		fix: number
	}

	export type Diffraction = {
		divisions: Array<number>,
		feeValues: Array<number>,
		feeTotal: number,
		diffraction: DiffractionTemp
	}

	export function defined(value: any): boolean
	export function definedNumber(value: any): boolean
	export function minmax(value: number, min: number, max: number): number
	export function bankersRounding(num: number, decimalPlaces?: number, base?: number): number
	export function toFixedNumber(num: number, decimalPlaces?: number, base?: number): number
	export function divide(amount: number, portions: Array<number>, decimalPlaces: number, total: number): Array<number>
	export function calculateDiffraction ( amount: number, diffraction: Array<DiffractionTemp>, normalisationMethod: NormalisationMethod, rounding?: number ): Diffraction
}

declare module 'bankers-math' {
	export = BankersMath;
}
