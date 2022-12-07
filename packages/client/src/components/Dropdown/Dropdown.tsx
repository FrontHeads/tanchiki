import './Dropdown.css';

import { cloneElement, FC, useEffect, useRef, useState } from 'react';

import { DropdownProps } from './typings';

export const Dropdown: FC<DropdownProps> = ({ trigger, menu }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as HTMLElement)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuRef]);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="dropdown" ref={menuRef}>
      {cloneElement(trigger, {
        onClick: handleOpen,
        'data-testid': 'dropdown-trigger',
      })}
      {open ? (
        <ul className="dropdown__menu">
          {menu.map((menuItem, index) => (
            <li key={index} className="dropdown__menu-item">
              {cloneElement(menuItem, {
                onClick: () => {
                  if (menuItem.props.onClick) {
                    menuItem.props.onClick();
                    setOpen(false);
                  }
                },
                className: 'dropdown__menu-button',
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
