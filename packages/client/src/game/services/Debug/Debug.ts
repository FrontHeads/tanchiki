import { type Game } from '../';

export class Debug {
  errorOutputMethod = alert;
  active = false;

  constructor(private game: Game) {
    // Сразу загружаем, чтобы отлавливание ошибок началось как можно раньше
    this.load();
  }

  load() {
    if (!this.active && this.game.state.debugging && typeof window !== 'undefined') {
      window.addEventListener('error', this.errorHandler);
      this.active = true;
    }
  }

  unload() {
    if (this.game.state.debugging && typeof window !== 'undefined') {
      window.removeEventListener('error', this.errorHandler);
      this.active = false;
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
