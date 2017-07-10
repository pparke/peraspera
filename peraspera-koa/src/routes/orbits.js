import router from 'koa-router';
import resource from '../lib/resource';

const orbits = resource(router(), 'orbits', 'orbits');

export default orbits;
