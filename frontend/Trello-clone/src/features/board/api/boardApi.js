import {
  createCard,
  createColumn,
  deleteCard,
  deleteColumn,
  getBoards,
  getBoardDetail,
  getCardsByColumn,
  getColumnsByBoard,
  moveCard,
  moveColumn,
  updateCard,
  updateColumn,
} from './mockBoardApi';

// API adapter layer:
// Keep this file's API shape stable, then swap mock calls with real HTTP calls later.
const boardApi = {
  getBoards,
  getBoardDetail,
  getColumnsByBoard,
  getCardsByColumn,
  createColumn,
  updateColumn,
  deleteColumn,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  moveColumn,
};

export default boardApi;
