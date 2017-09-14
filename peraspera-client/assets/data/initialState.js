export default {
	title: 'Per Aspera',
	currentDisplay: 'sector',
	player: {
		ship: 1,
		sector: 1
	},
 	menus: {
		main: {
			items: [
				{
					text: 'System',
					link: 'system'
				},
				{
					text: 'Galaxy',
					link: 'galaxy'
				},
				{
					text: 'Ship',
					link: 'ship'
				},
				{
					text: 'Dashboard',
					link: 'dashboard'
				}
			]
    }
  },
  systems: {
  },
  sectors: {
  },
  planets: {
  },
  ships: {
  },
  menuItems: {
    '0': {
      text: 'Sector',
      action: 'SHOW_SECTOR_MAP'
    },
    '1': {
      text: 'Galaxy',
      action: 'SHOW_GALAXY_MAP'
    },
    '2': {
      text: 'Ship',
      action: 'SHOW_SHIP_DETAILS'
    }
  }
};
