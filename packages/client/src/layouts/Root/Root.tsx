import './Root.css';

import { NavLink, Outlet, useNavigation } from 'react-router-dom';

const Layout: React.FC = () => {
  const navigation = useNavigation();

  return (
    <div className={['layout', `layout_state_${navigation.state}`].join(' ')}>
      <nav className="layout__nav">
        <ul className="layout__nav-list">
          <li className="layout__nav-item">
            <NavLink className="layout__nav-link" to={`/`}>
              App
            </NavLink>
          </li>
          <li className="layout__nav-item">
            <NavLink className="layout__nav-link" to={`/hello/FrontHeads`}>
              Hello
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
