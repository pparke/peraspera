import router from 'koa-router';
import resource from '../lib/resource';
import Character from '../models/Character';

const characters = resource(router(), 'characters', 'characters');

characters.get('/roll', async (ctx, next) => {

    ctx.body.roll = d6() + d6() + d6();

    await next();
});

function d6() {
    return Math.ceil(Math.random() * 6);
}

export default characters;
