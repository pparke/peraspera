import router from 'koa-router';
import resource from '../lib/resource';

const sectors = resource(router(), 'sectors', 'sectors');

export default sectors;
