import './Dropdown.css';

import { cloneElement, FC, useEffect, useRef, useState } from 'react';

import { DropdownProps } from './typings';

export const Dropdown: FC<DropdownProps> = ({ trigger, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** При добавлении компонента Dropdown на страницу подписываемся на клик мышкой,
   * если клик был совершен снаружи dropdown, то закрываем его.
   * Когда Dropdown исчезает со страницы, выполняем return callback
   * */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as HTMLElement)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownRef]);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  /** С помощью функции cloneElement пробрасываем элемент trigger с целевой страницы
   *  и добавляем ему функцию-обработчик toggleIsOpen
   * */
  return (
    <div className="dropdown" ref={dropdownRef}>
      {cloneElement(trigger, {
        onClick: toggleIsOpen,
      })}
      {isOpen ? (
        <ul className="dropdown__menu">
          {menuItems.map(({ title, onClick, ...rest }, index) => (
            <li key={index} className="dropdown__menu-item">
              <button
                onClick={event => {
                  toggleIsOpen();
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
