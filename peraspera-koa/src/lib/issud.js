import squel from 'squel';
const sqp = squel.useFlavour('postgres');

export async function index(db, table, query) {
  const q = sqp.select().from(table);
  for(const key in query) {
    if (Array.isArray(query[key])) {
      q.where(`${key} in ?`, query[key]);
    }
    else {
      q.where(`${key} = ?`, query[key]);
    }
  }
  const result = await db.query(q.toString());
  return result.rows;
}

export async function show(db, table, id) {
  const q = sqp.select()
             .from(table)
             .where('id = ?', id)
             .toString();
  const result = await db.query(q);
  return result.rows[0];
}

export async function store(db, table, record) {
  const q = sqp.insert().into(table);
  for(const key in record) {
    q.set(key, record[key]);
  }

  q.set('updated_at', 'now()');

  q.returning('*');
  const results = await db.query(q.toString());

  return results.rows[0];
}

export async function update(db, table, id, changes) {
  const q = sqp.update()
           .table(table)
           .setFields(changes);

  q.set('updated_at', 'now()');

  q.where('id = ?', id).returning('*');

  const results = await db.query(q.toString());

  return results.rows[0];
}

export async function del(db, table, id) {
  const q = sqp.delete()
             .from(table)
             .where('id = ?', id)
             .returning('*')
             .toString();
  const results = await db.query(q);

  return results.rows;
}
