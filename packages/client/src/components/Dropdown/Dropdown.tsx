import './Dropdown.css';

import { cloneElement, FC, useEffect, useRef, useState } from 'react';

import { DropdownProps } from './typings';

export const Dropdown: FC<DropdownProps> = ({ trigger, menuItems }) => {
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
          {menuItems.map(({ title, onClick, ...rest }, index) => (
            <li key={index} className="dropdown__menu-item">
              <button
                onClick={event => {
                  handleOpen();
                  onClick(event);
                }}
                className="dropdown__menu-button"
                {...rest}>
                {title}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
