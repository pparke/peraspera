import React from 'react';
import '../../assets/scss/page.scss';

const Page = ({title, children}) => (
  <div className='page'>
    { children }
  </div>
);

export default Page;
