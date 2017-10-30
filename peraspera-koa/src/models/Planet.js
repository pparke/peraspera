import Model from './Model';
import System from './System';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
    name: 'planets',
    fields: ['id', 'name', 'description', 'mass', 'radius', 'population', 'temperature', 'atmosphere', 'system_id', 'sector_id'],
    assignable: ['name', 'description', 'mass', 'radius', 'population', 'temperature', 'atmosphere', 'system_id', 'sector_id']
};

export default class Planet extends Model {
    constructor({ id, name, description, mass, radius, population, temperature, atmosphere, system_id, sector_id } = {}) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.mass = mass;
        this.radius = radius;
        this.population = population;
        this.temperature = temperature;
        this.atmosphere = atmosphere;
        this.system_id = system_id;
        this.sector_id = sector_id;
    }

    static get table() {
        return table;
    }

    async system(db) {
        return this.belongsTo(db, System, 'system_id');
    }
}
