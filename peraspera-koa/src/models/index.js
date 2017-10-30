// models
import Passwd from './Passwd';
import Planet from './Planet';
import Sector from './Sector';
import Ship from './Ship';
import Station from './Station';
import System from './System';
import User from './User';
import Wormhole from './Wormhole';

/**
* Model Middleware
*/
export const models = async function modelMiddleware(ctx, next) {
    ctx.models = { Passwd, Planet, Sector, Ship, Station, System, User, Wormhole };
    await next();
    delete ctx.models;
};

//

// call the associate function if defined on the model
Object.keys(models).forEach(name => {
    const model = models[name];
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

export default models;
