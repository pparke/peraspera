import env from 'dotenv';

env.config({ silent: true });

export default {
  env: process.env.NODE_ENV,
  api: {
    port: process.env.SERVER_PORT || 3000
  },
  db: {
    host: process.env.SERVER_DB_HOST,
    name: process.env.SERVER_DB_DATABASE,
    port: process.env.SERVER_DB_PORT || 5432,
    user: process.env.SERVER_DB_USER,
    pass: process.env.SERVER_DB_PASSWORD
  },
	universe: {
    seed: ['1234', '5678', '7890'],
		maxCoord: 2000,
		starTypes: [
		  null,
		  'White Dwarf',
		  'Red Dwarf',
		  'Orange',
		  'Yellow',
		  'Yellow-White',
		  'White',
		  'Blue-White',
		  'Blue',
		  'stellar nebula',
		  'planetary nebula',
		  'red giant',
		  'blue giant',
		  'red supergiant',
		  'neutron',
		  'brown dwarf',
		  'black hole'
		],
		starProbabilities: {
		  'Red Dwarf': 0.8,
		  'Orange': 0.08,
		  'White Dwarf': 0.05,
		  'Yellow': 0.035,
		  'Yellow-White': 0.02,
		  'White': 0.007,
		  'Blue-White': 0.001,
		  'Blue': 0.0000001
		}
	}
};
