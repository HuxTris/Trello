import {
  createCard,
  createColumn,
  deleteCard,
  deleteColumn,
  getBoardDetail,
  moveCard,
  updateCard,
  updateColumn,
} from './mockBoardApi';

// API adapter layer:
// Keep this file's API shape stable, then swap mock calls with real HTTP calls later.
const boardApi = {
  getBoardDetail,
  createColumn,
  updateColumn,
  deleteColumn,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
};

export default boardApi;
