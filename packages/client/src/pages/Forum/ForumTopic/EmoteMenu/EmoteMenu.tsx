import './EmoteMenu.css';

import { type FC } from 'react';

import { Dropdown } from '../../../../components/Dropdown';
import { emoteMenuSvgPath } from './data';
import { type EmoteMenuProps } from './typings';

export const EmoteMenu: FC<EmoteMenuProps> = ({ onEmojiSelect }) => {
  return (
    <Dropdown
      trigger={
        <div className="emote-menu">
          <svg
            className="emote-menu__svg"
            viewBox="0 0 330 330"
            fill="#fff"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <path d={emoteMenuSvgPath.circle} fill="" />
            <path d={emoteMenuSvgPath.mouth} fill="" />
            <path d={emoteMenuSvgPath.eyeLeft} fill="" />
            <path d={emoteMenuSvgPath.eyeRight} fill="" />
          </svg>
        </div>
      }
      className="emote-menu__dropdown"
      emoteClass="dropdown__menu-button-emote"
      menuItems={[
        { onClick: () => onEmojiSelect('👍'), title: '👍' },
        { onClick: () => onEmojiSelect('🔥'), title: '🔥' },
        { onClick: () => onEmojiSelect('🚀'), title: '🚀' },
        { onClick: () => onEmojiSelect('😀'), title: '😀' },
        { onClick: () => onEmojiSelect('✅'), title: '✅' },
        { onClick: () => onEmojiSelect('👎'), title: '👎' },
        { onClick: () => onEmojiSelect('💩'), title: '💩' },
        { onClick: () => onEmojiSelect('☹️'), title: '☹️' },
        { onClick: () => onEmojiSelect('❌'), title: '❌' },
        { onClick: () => onEmojiSelect('💯'), title: '💯' },
      ]}
    />
  );
};
