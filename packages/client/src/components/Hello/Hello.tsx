import './Hello.css';

const Hello: React.FC<{ topic: string }> = props => (
  <div className="hello">
    <h1 className="hello_inner">Hello {props.topic}!</h1>
  </div>
);

export default Hello;
