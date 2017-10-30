import squel from 'squel';
const sqp = squel.useFlavour('postgres');

export default class Model {

    constructor() {
    }

    pick(o, props) {
        return Object.assign({}, ...props.map(prop => ({ [prop]: o[prop] })));
    }

    get table() {
        return this.constructor.table;
    }

    get fields() {
        return this.constructor.table.fields;
    }

    get name() {
        return this.constructor.table.name;
    }

    serialize() {
        return this.fields.reduce((obj, field) => {
            obj[field] = this[field];
            return obj;
        }, {});
    }

    async save(db) {
        const _class = this.constructor;
        if (!this.id) {
            const record = await Model.insert(db, _class, this);
            this.id = record.id;
            if (_class.table.fields.includes('created_at')) {
                this.created_at = record.created_at;
            }
            if (_class.table.fields.includes('updated_at')) {
                this.updated_at = record.updated_at;
            }
            return this;
        }

        const record = await Model.update(db, _class, this);
        if (_class.table.fields.includes('updated_at')) {
            this.updated_at = record.updated_at;
        }
        return this;
    }

    static async insert(db, ModelClass, record) {
        let stmt = sqp.insert()
        .into(ModelClass.table.name);

        ModelClass.table.assignable.forEach((field) => {
            if (typeof record[field] !== 'undefined') {
                stmt = stmt.set(field, record[field]);
            }
        });

        const sql = stmt.returning('*').toString();

        const result = await db.query(sql);
        return result.rows[0];
    }

    static async update(db, ModelClass, record) {
        let stmt = sqp.update()
        .table(ModelClass.table.name);

        ModelClass.table.assignable.forEach((field) => {
            if (typeof record[field] !== 'undefined') {
                stmt = stmt.set(field, record[field]);
            }
        });
        if (ModelClass.table.fields.includes('updated_at')) {
            stmt = stmt.set('updated_at', 'NOW()');
        }
        const sql = stmt.returning('*').toString();

        const result = await db.query(sql);
        return result.rows[0];
    }

    static async find(db, ModelClass, id) {
        const sql = sqp.select()
        .from(ModelClass.table.name)
        .where('id = ?', id)
        .limit(1)
        .toString();

        const result = await db.query(sql);
        return new ModelClass(result.rows[0]);
    }

    static async findWhere(db, ModelClass, query) {
        let sql = sqp.select()
        .from(ModelClass.table.name);

        sql = Object.keys(query).reduce((s, key) => {
            if (Array.isArray(query[key])) {
                return s.where(`${key} in ?`, query[key]);
            }
            return s.where(`${key} = ?`, query[key]);
        }, sql);

        sql = sql.limit(1)
        .toString();

        const result = await db.query(sql);
        return new ModelClass(result.rows[0]);
    }

    static async findAll(db, ModelClass) {
        const sql = sqp.select()
        .from(ModelClass.table.name)
        .toString();

        const result = await db.query(sql);
        return result.rows.map(row => new ModelClass(row));
    }

    static async remove(db, ModelClass, id) {
        const sql = sqp.delete()
        .from(ModelClass.table.name)
        .where('id = ?', id)
        .toString();

        const result = await db.query(sql);
        return result.rows[0];
    }

    /**
    * Find the record that belongs to this
    * record
    * @param  {Model}  model  the class of the model we're looking for
    * @param  {string}  fkey  the foreign key on the table
    * @return {Promise}       [description]
    */
    async hasOne(db, ModelClass, fkey) {
        const sql = sqp.select()
        .from(ModelClass.table.name)
        .where(`${fkey} = ?`, this.id)
        .limit(1)
        .toString();

        const result = await db.query(sql);
        return new ModelClass(result.rows[0]);
    }

    async belongsTo(db, ModelClass, fkey) {
        const sql = sqp.select()
        .from(ModelClass.table.name)
        .where('id = ?', this[fkey])
        .limit(1)
        .toString();

        const result = await db.query(sql);
        return new ModelClass(result.rows[0]);
    }

    async hasMany(db, ModelClass, fkey) {
        const sql = sqp.select()
        .from(ModelClass.table.name)
        .where(`${fkey} = ?`, this.id)
        .toString();

        const result = await db.query(sql);
        return result.rows.map(record => new ModelClass(record));
    }
}
