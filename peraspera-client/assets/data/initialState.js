export default {
	title: 'Per Aspera',
  currentDisplay: 'sector',
  menus: {
    main: {
      menuItems: ['0', '1', '2']
    }
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
