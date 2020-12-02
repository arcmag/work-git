import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../css/main.css';
import Game from './game';

Game.start({
  container: `#container`,
  wrapper: `<div class="row game__board"></div>`,
  cell: `<div class="game__board-item col-md-1 offset-md-1"></div>`,
  cellSelectedClass: `game__board-item--selected`,
  cellWinnerClass: `game__board-item--winner`,
  btnReset: `#btn-reset`,
  btnFinish: `#btn-finish`,
  result: `#container-result`,
});
