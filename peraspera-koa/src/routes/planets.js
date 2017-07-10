import router from 'koa-router';
import resource from '../lib/resource';

const planets = resource(router(), 'planets', 'planets');

export default planets;
