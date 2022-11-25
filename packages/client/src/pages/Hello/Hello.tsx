import './Hello.css';

import { useParams } from 'react-router-dom';

export const Hello: React.FC = () => {
  const { topic } = useParams();

  return (
    <div className="hello">
      <h1 className="hello_inner">Hello {topic}!</h1>
    </div>
  );
};
