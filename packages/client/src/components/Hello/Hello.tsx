import css from './Hello.module.css';

const Hello: React.FC<{ topic: string }> = props => (
  <div className={css.hello}>
    <h1 className={css.text}>Hello {props.topic}!</h1>
  </div>
);

export default Hello;
