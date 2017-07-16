import router from 'koa-router';
import resource from '../lib/resource';

const starTypes = resource(router(), 'starTypes', 'star_type');

export default starTypes;
