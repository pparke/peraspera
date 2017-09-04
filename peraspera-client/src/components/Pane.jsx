import React from 'react';
import '../../assets/scss/pane.scss';

const Pane = ({ theme, title, children }) => {
  const className = `pane ${theme || ''}`;
	return (
		<div className={className}>
			<div className='top-bar'>
        <div className='control'></div>
        <div className='title'>{ title }</div>
      </div>
      <div className='content'>
        { children }
      </div>
		</div>
  );
};

export default Pane;
