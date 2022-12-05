import './Dropdown.css';

import { cloneElement, FC, useEffect, useState } from 'react';

import { DropdownProps } from './typings';

export const Dropdown: FC<DropdownProps> = ({ trigger, menu }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="dropdown">
      {cloneElement(trigger, {
        onClick: handleOpen,
      })}
      {open ? (
        <ul className="dropdown__menu">
          {menu.map((menuItem, index) => (
            <li key={index} className="menu-item">
              {cloneElement(menuItem, {
                onClick: () => {
                  if (menuItem.props.onClick) {
                    menuItem.props.onClick();
                    setOpen(false);
                  }
                },
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
