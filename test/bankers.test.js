const Services = require( '../Banker' )

beforeAll(async () => {
} )

describe('Rounding', function () {
	test('Bankers rounding', async function () {
		let round1 = Services.bankersRounding( 2.5, 0 )
		expect( round1 ).toEqual( 2 )
		let round2 = Services.bankersRounding( 3.5, 0 )
		expect( round2 ).toEqual( 4 )
		let round3 = Services.bankersRounding( 0.025, 2 )
		expect( round3 ).toEqual( 0.02 )
		let round4 = Services.bankersRounding( 0.035, 2 )
		expect( round4 ).toEqual( 0.04 )
	} )
} )

describe('Diffraction', function () {
	test('Divide', async function () {
		let division = Services.divide( 1000000, [ 0.2, 0.4, 0.5 ], 2 )
		expect( division ).toEqual( [ 181818.18, 363636.36, 454545.46 ] )
	} )
	test('Diffraction', async function () {
		console.log( Services.calculateDiffraction( 1000, [ { percent: 10, max: 10 }, { percent: 20 }, { percent: 30 } ] ) )
		console.log( Services.calculateDiffraction( 1000, [ { percent: 30 }, { percent: 40 }, { percent: 60 } ] ) )
		console.log( Services.calculateDiffraction( 1000, [ { percent: 30 }, { percent: 40 }, { percent: 60 } ], Services.DIFFRA_PROPORT ) )
		console.log( Services.calculateDiffraction( 1000, [ { percent: 30 }, { percent: 40 }, { percent: 60 } ], Services.DIFFRA_PAYOFF ) )
	} )
} )
