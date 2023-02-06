import '../controller.css';
import './Buttons.css';

import { type FC } from 'react';

export const Buttons: FC = () => {
  return (
    <div className="controller">
      <div className="controller__service">
        <div className="controller__service-btn controller__service-btn_pause">
          <svg viewBox="1 1 22 22" strokeWidth={'2'} strokeLinecap={'round'} strokeLinejoin={'round'}>
            <path d="M10 15V9" />
            <path d="M14 15V9" />
            <path d="M7.714 2h8.572L22 7.714v8.572L16.286 22H7.714L2 16.286V7.714L7.714 2z" />
          </svg>
        </div>
        <div className="controller__service-btn controller__service-btn_fullscreen">
          <svg viewBox="0 0 512 512">
            <path d="M0,0v512h512V0H0z M477.867,477.867H34.133V34.133h443.733V477.867z" />
            <polygon points="126.533,102.4 199.111,102.4 199.111,68.267 68.267,68.267 68.267,199.111 102.4,199.111 102.4,126.538     198.422,222.558 222.556,198.423   " />
            <polygon points="222.557,313.581 198.422,289.445 102.4,385.467 102.4,312.889 68.267,312.889 68.267,443.733 199.111,443.733     199.111,409.6 126.538,409.6   " />
            <polygon points="409.6,312.889 409.6,385.467 313.578,289.444 289.444,313.578 385.462,409.6 312.889,409.6 312.889,443.733     443.733,443.733 443.733,312.889   " />
            <polygon points="312.889,68.267 312.889,102.4 385.467,102.4 289.444,198.423 313.578,222.558 409.6,126.538 409.6,199.111     443.733,199.111 443.733,68.267   " />
          </svg>
        </div>
        <div className="controller__service-btn controller__service-btn_mute">
          <svg viewBox="0 0 36 36" strokeWidth={'0'}>
            <path d="M24.87,6.69A12.42,12.42,0,0,1,28.75,26.3l1.42,1.42A14.43,14.43,0,0,0,25.74,4.88a1,1,0,0,0-.87,1.8Z" />
            <path d="M27.3,27.67h0l-3.84-3.84-.57-.57h0L4.63,5,3.21,6.41,8.8,12H3a1,1,0,0,0-1,1V23a1,1,0,0,0,1,1H8.83l9.51,8.3A1,1,0,0,0,20,31.55V23.2l5.59,5.59c-.17.1-.34.2-.51.29a1,1,0,0,0,.9,1.79c.37-.19.72-.4,1.08-.62l2.14,2.14L30.61,31l-3.25-3.25Z" />
            <path d="M22.69,12.62A6.27,6.27,0,0,1,25.8,18a6.17,6.17,0,0,1-1.42,3.92l1.42,1.42a8.16,8.16,0,0,0,2-5.34,8.28,8.28,0,0,0-4.1-7.11,1,1,0,1,0-1,1.73Z" />
            <path d="M20,4.62a1,1,0,0,0-1.66-.75l-6.42,5.6L20,17.54Z" />
          </svg>
        </div>
      </div>
      <div className="controller__fire">
        <button className="controller__fire-btn">
          <svg fill="#fff" viewBox="0 0 611.999 611.999">
            <path d="M216.02,611.195c5.978,3.178,12.284-3.704,8.624-9.4c-19.866-30.919-38.678-82.947-8.706-149.952   c49.982-111.737,80.396-169.609,80.396-169.609s16.177,67.536,60.029,127.585c42.205,57.793,65.306,130.478,28.064,191.029   c-3.495,5.683,2.668,12.388,8.607,9.349c46.1-23.582,97.806-70.885,103.64-165.017c2.151-28.764-1.075-69.034-17.206-119.851   c-20.741-64.406-46.239-94.459-60.992-107.365c-4.413-3.861-11.276-0.439-10.914,5.413c4.299,69.494-21.845,87.129-36.726,47.386   c-5.943-15.874-9.409-43.33-9.409-76.766c0-55.665-16.15-112.967-51.755-159.531c-9.259-12.109-20.093-23.424-32.523-33.073   c-4.5-3.494-11.023,0.018-10.611,5.7c2.734,37.736,0.257,145.885-94.624,275.089c-86.029,119.851-52.693,211.896-40.864,236.826   C153.666,566.767,185.212,594.814,216.02,611.195z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
