import './EmoteMenu.css';

import { type FC } from 'react';

import { Dropdown } from '../../../../components/Dropdown';
import { emoteMenuSvgPath } from './data';
import { type EmoteMenuProps } from './typings';

export const EmoteMenu: FC<EmoteMenuProps> = ({ onEmojiSelect }) => {
  return (
    <Dropdown
      trigger={
        <button type="button" className="emote-menu">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 1024 1024"
            fill="#000000"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <path d={emoteMenuSvgPath.face} fill="" />
            <path d={emoteMenuSvgPath.circle} fill="" />
          </svg>
        </button>
      }
      className="emote-menu__dropdown"
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
