import './Dropdown.css';

import cn from 'classnames';
import { type FC, cloneElement, useEffect, useRef, useState } from 'react';

import { type DropdownProps } from './typings';

export const Dropdown: FC<DropdownProps> = ({ trigger, menuItems, className, emoteClass }) => {
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
    <div className={cn('dropdown', className)} ref={dropdownRef}>
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
                className={cn('dropdown__menu-button', emoteClass)}
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
