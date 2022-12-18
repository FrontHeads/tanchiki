import { Component } from 'react';

import { ErrorBody } from '../ErrorBody/ErrorBody';
import { Props, State } from './typings';

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorBody status="Ошибка" message="Обновите страницу" isRefresh={true} />;
    }

    return this.props.children;
  }
}
