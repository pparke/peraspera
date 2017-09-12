import reduxApi, {transformers} from "redux-api";
import adapterFetch from "redux-api/lib/adapters/fetch";
import config from '../../config.js';

export default reduxApi({
  // simple endpoint description
  systems: `${config.api.url}/systems/:id`,
  starTypes: `${config.api.url}/starTypes/:id`,
  wormholes: `${config.api.url}/wormholes/:id`,
  ships: `${config.api.url}/ships/:id`,
  }
}).use("fetch", adapterFetch(fetch)); // it's necessary to point using REST backend
