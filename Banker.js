
// EU on Bankers' rounding: https://ec.europa.eu/economy_finance/publications/pages/publication1224_en.pdf

const NA = 'NA'
const E = 1e-8
const DIFFRA_EQ = 'Equilibrium'
const DIFFRA_PROPORT = 'Proportionality'
const DIFFRA_PAYOFF = 'Payoff'

const reducer = (accumulator, currentValue) => { return accumulator + currentValue }

const DIFF_TEMP = { min: 0, max: 0, fix: 0, percent: 0 }

let Services = {
	E,
	NA,
	DIFFRA_EQ,
	DIFFRA_PROPORT,
	DIFFRA_PAYOFF,

	sum (list) {
		return list.length > 0 ? list.reduce((acc, current) => acc + current, 0) : 0
	},
	avg (list) {
		return list.length > 0 ? Services.sum(list) / list.length : 0
	},
	variance (list) {
		let avg = Services.avg(list)
		const squareDiffs = list.map((value) => {
			const diff = value - avg;
			return diff * diff;
		})
		return Math.sqrt( squareDiffs.reduce((acc, current) => acc + current, 0) / list.length )
	},
	analyseValues ( list, decimalPlaces = 6 ) {
		let sum = Services.sum(list)
		let avg = Services.toFixedNumber( list.length > 0 ? sum / list.length : 0, decimalPlaces )

		const squareDiffs = list.map((value) => {
			const diff = value - avg;
			return diff * diff;
		})
		let variance = Services.toFixedNumber( Math.sqrt( squareDiffs.reduce((acc, current) => acc + current, 0) / list.length ), decimalPlaces )
		return {
			sum,
			avg,
			variance
		}
	},

	defined (value) {
		return value !== undefined && value !== null
	},
	definedNumber (value) {
		return value !== undefined && value !== null && ( value.isNaN ? (!value.isNaN() && (!value.isFinite || value.isFinite()) ) : !Number.isNaN(value) && Number.isFinite(value) )
	},
	minmax (value, min, max) {
		return value < min ? min : (value > max ? max : value)
	},
	bankersRounding ( num, decimalPlaces = 2, base = 10 ) {
		let pow = Math.pow(base, decimalPlaces)
		let powed = +(num * pow)
		let floor = Math.floor( powed )
		let fDiff = powed - floor
		let r = (fDiff > 0.5 - E && fDiff < 0.5 + E) ? ((floor % 2 == 0) ? floor : floor + 1) : Math.round( powed )
		return r / pow
	},
	toFixedNumber (num, decimalPlaces = 2, base = 10) {
		const pow = Math.pow(base, decimalPlaces)
		return +(Math.round(num * pow) / pow)
	},
	divide (amount, portions, decimalPlaces, total) {
		let finals = []

		let sum = total || portions.reduce(reducer)

		let numerator = 0, divident = 0, value = 0, iteration = amount
		for (let i = 0; i < portions.length; ++i) {
			divident = divident === 0 ? sum : divident - numerator
			if (divident === 0) divident = 1
			numerator = portions[i]

			value = Services.toFixedNumber( iteration * numerator / (divident || 1), decimalPlaces )
			iteration = iteration - value

			finals.push( value )
		}
		return finals
	},
	calculateDiffraction ( amount, diffraction, normalisationMethod, rounding = 2 ) {
		let percentages = diffraction.map( (diff) => { return diff.percent } )
		let percentageSum = percentages.reduce( (acc, percent) => { return acc + percent } )
		let totalFee = Services.toFixedNumber( amount * percentageSum / 100, rounding )
		let divisions = Services.divide( totalFee, percentages, rounding )

		let feeValues = [], feeTotal = 0
		for (let i = 0; i < divisions.length; ++i) {
			let diff = Object.assign( {}, DIFF_TEMP, diffraction[i] )
			let feeValue = Services.minmax( divisions[ i ] + diff.fix, diff.min || 0, diff.max || (totalFee + diff.fix) )
			feeValues.push( feeValue )
			feeTotal += feeValue
		}

		if ( normalisationMethod && normalisationMethod !== NA ) {
			if (feeTotal < amount) {
				if ( normalisationMethod === DIFFRA_EQ )
					feeValues = Services.divide( amount, feeValues, rounding )
			}
			else if (feeTotal > amount) {
				if ( normalisationMethod === DIFFRA_PROPORT ) {
					feeValues = Services.divide( amount, feeValues, rounding )
				} else if ( normalisationMethod === DIFFRA_PAYOFF ) {
					let toCut = feeTotal - amount
					for (let i = feeValues.length - 1; toCut > 0 && i >= 0; --i) {
						let tc = toCut <= feeValues[i] ? toCut : feeValues[i]
						feeValues[i] -= tc
						toCut -= tc
					}
				}
			}
		}
		return { divisions, feeValues, feeTotal, diffraction }
	}

}

module.exports = Services
