import router from 'koa-router';
import resource from '../lib/resource';

const wormholes = resource(router(), 'wormholes', 'wormholes');

export default wormholes;
