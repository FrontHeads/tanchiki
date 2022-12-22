import { Screen } from './Screen';

export class GameOverScreen extends Screen {
  show() {
    this.overlay.animate(this.updateStage.bind(this));
  }

  updateStage(counter = 0) {
    const { view } = this.overlay;
    const fontSize = 5;
    const posY = view.height - counter;
    //Выравнивание по высоте
    const middle = (view.height - fontSize) / 2;

    // Тригерит удаление интервала и остановку анимации.
    // Т.е. анимация останавливается когда надпись Потрачено достигает центра экрана.
    if (posY < middle) {
      return false;
    }

    this.overlay.clearScreen();
    this.overlay.renderElement({
      posX: 0,
      posY,
      width: view.width,
      height: fontSize,
      text: 'ПОТРАЧЕНО',
      color: 'red',
      // Выравнивание по ширине
      align: 'center',
    });

    return true;
  }
}
