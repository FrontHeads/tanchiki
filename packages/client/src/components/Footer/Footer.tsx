import './Footer.css';

import { type FC } from 'react';

import fhLogo from '/assets/img/fh_logo.png';

export const Footer: FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer data-testid="footer" className="footer">
      <div className="delimiter" />
      <div className="footer__inner">
        <img src={fhLogo} alt="FrontHeads Team" className="footer__logo" />
        <span>FrontHeads team, {year}</span>
      </div>
    </footer>
  );
};
