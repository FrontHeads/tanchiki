import { type Game } from '../';

export class Debug {
  errorOutputMethod = alert;

  constructor(private game: Game) {
    // Прокидываем инстанс основного сервиса игры, чтобы получить доступ к состоянию игрового движка (this.game.state)
  }

  load() {
    if (this.game.state.debugging && typeof window !== 'undefined') {
      window.addEventListener('error', this.errorHandler);
    }
  }

  unload() {
    if (this.game.state.debugging && typeof window !== 'undefined') {
      window.removeEventListener('error', this.errorHandler);
    }
  }

  errorHandler = (error: ErrorEvent) => {
    const errorReport = {
      message: error.message,
      file: error.filename,
      line: error.lineno,
      column: error.colno,
      target: error.target?.toString() || '',
    };

    this.reportError(errorReport);
  };

  reportError(errorReport: Record<string, string | number>) {
    let result = '';

    for (const [entryName, entryValue] of Object.entries(errorReport)) {
      result += `${entryName.toUpperCase()}: ${entryValue}\n\n`;
    }

    this.errorOutputMethod.call(null, result);
  }
}
