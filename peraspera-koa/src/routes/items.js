import router from 'koa-router';
import resource from '../lib/resource';

const items = resource(router(), 'items', 'items');

export default items;
