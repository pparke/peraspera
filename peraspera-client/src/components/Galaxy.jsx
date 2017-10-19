import React from 'react';
import store from '../lib/Store';
import MainLoop from '../lib/MainLoop';
import Viewport from '../lib/Viewport';
import Input from '../lib/Input';
import System from '../lib/System';
import Galaxy from '../lib/Galaxy';
import { randomColor } from '../lib/util';

// components
import Canvas from './Canvas';

// assets
import '../../assets/scss/galaxy.scss';

class GalaxyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      systems: {},
      currentSystem: null
    };

    this.setupGalaxy = this.setupGalaxy.bind(this);
  }

  setupGalaxy(ctx) {
    this.viewport = new Viewport(800, 600, ctx);
    this.mainLoop = new MainLoop();
    this.galaxy = new Galaxy();
    this.viewport.addToRender(this.galaxy);
    this.mainLoop.addToUpdate(this.viewport);
    this.mainLoop.start();
    this.input = createInput(this.viewport, this.galaxy);
  }

  render() {
    return (
      <div className='galaxy' style={style}>
        <Canvas onMount={this.setupGalaxy} />
      </div>
    );
  }
}

const style = {
  width: '100vw',
  height: '100vh'
}

function createInput(viewport, galaxy) {
  return new Input(
    viewport.canvas,
    {
      right: {
        keydown: () => viewport.move(10, 0)
      },
      left: {
        keydown: () => viewport.move(-10, 0)
      },
      up: {
        keydown: () => viewport.move(0, -10)
      },
      down: {
        keydown: () => viewport.move(0, 10)
      }
    },
    {
      left: {
        ondown: (mouse) => {
          viewport.onDragStart(mouse.pos.x, mouse.pos.y);
          const { x, y } = viewport.toWorldCoords(mouse.pos.x, mouse.pos.y);
          const star = galaxy.findStarAt(x, y);
          console.log(`x: ${x} y: ${y} viewport position: ${JSON.stringify(viewport.position)} star: ${JSON.stringify(star)}`);
        }
      },
      middle: {},
      right: {},
      mousemove: (mouse) => {
        const worldPos = viewport.toWorldCoords(mouse.pos.x, mouse.pos.y);
        viewport.mousePos = worldPos;
        if (mouse.buttons.left.pressed) {
          viewport.onDrag(mouse);
        }
      },
      mousewheel: (mouse) => {
        viewport.zoom(mouse.wheelDelta, mouse.pos.x, mouse.pos.y);
      }
    }
  );
}

const mapStore = store => {

}

export default store.connect(mapStore)(GalaxyComponent);
