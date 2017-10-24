export function playerStatsView(store) {
  const { player } = store.state;
  const playerShip = store.findRecord('ships', player.ship);
  const currentSystem = store.findRecord('systems', player.system);
  const systemSectors = store.findAll('sectors');
}
