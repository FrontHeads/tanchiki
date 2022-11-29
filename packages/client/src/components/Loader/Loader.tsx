import './Loader.css';

export const Loader: React.FC = () => {
  return (
    <div className="loader" data-testid="loader">
      <div className="loader__circle"></div>
      <div className="loader__background"></div>
    </div>
  );
};
