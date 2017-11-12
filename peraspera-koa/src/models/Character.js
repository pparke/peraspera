import Model from './Model';
import User from './User';
import squel from 'squel';
const sqp = squel.useFlavour('postgres');

const table = {
  name: 'characters',
  fields: ['id', 'user_id', 'name', 'strength', 'intelligence', 'wisdom', 'dexterity', 'constitution', 'charisma', 'class_id', 'hit_dice', 'hp'],
  assignable: ['user_id', 'name', 'strength', 'intelligence', 'wisdom', 'dexterity', 'constitution', 'charisma', 'class_id', 'hit_dice', 'hp']
};

export default class Character extends Model {
  constructor({ id, user_id, name, strength, intelligence, wisdom, dexterity, constitution, charisma, class_id, hit_dice, hp } = {}) {
    super();
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.strength = strength;
    this.intelligence = intelligence;
    this.wisdom = wisdom;
    this.dexterity = dexterity;
    this.constitution = constitution;
    this.charisma = charisma;
    this.class_id = class_id;
    this.hit_dice = hit_dice;
    this.hp = hp;
  }

  static get table() {
    return table;
  }

  async user(db) {
    return this.belongsTo(db, User, 'user_id');
  }

}
