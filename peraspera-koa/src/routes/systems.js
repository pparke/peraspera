import router from 'koa-router';
import resource from '../lib/resource';

const systems = resource(router(), 'systems', 'systems');

export default systems;
