import {
  buildBoardTree,
  createInitialMockDb,
  reindexColumnsByBoard,
  selectBoards,
  selectCardsByColumn,
  selectColumnsByBoard,
} from './mockData/boardContentMock';

const MOCK_DELAY = 250;

const wait = (ms = MOCK_DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const mockDb = createInitialMockDb();

const getBoardOrThrow = (boardId) => {
  const board = mockDb.boards[boardId];
  if (!board) throw new Error(`Board ${boardId} not found`);
  return board;
};

const getColumnOrThrow = (columnId) => {
  const column = mockDb.columns[columnId];
  if (!column) throw new Error(`Column ${columnId} not found`);
  return column;
};

const getCardOrThrow = (cardId) => {
  const card = mockDb.cards[cardId];
  if (!card) throw new Error(`Card ${cardId} not found`);
  return card;
};

const ensureColumnBelongsToBoard = (column, boardId) => {
  if (column.boardId !== boardId) {
    throw new Error(`Column ${column.id} does not belong to board ${boardId}`);
  }
};

const listCardIdsByColumn = (columnId) =>
  Object.values(mockDb.cards)
    .filter((card) => card.columnId === columnId)
    .sort((a, b) => a.position - b.position)
    .map((card) => card.id);

const reindexCardsByCardIds = (columnId, cardIds) => {
  cardIds.forEach((cardId, index) => {
    const card = mockDb.cards[cardId];
    if (!card) return;
    card.columnId = columnId;
    card.position = index;
  });
};

const returnBoardSnapshot = async (boardId) => {
  await wait();
  const board = buildBoardTree(mockDb, boardId);
  if (!board) throw new Error(`Board ${boardId} not found`);
  return clone(board);
};

export const getBoards = async () => {
  await wait();
  return clone(selectBoards(mockDb));
};

export const getColumnsByBoard = async (boardId) => {
  getBoardOrThrow(boardId);
  await wait();
  return clone(selectColumnsByBoard(mockDb, boardId));
};

export const getCardsByColumn = async (columnId) => {
  getColumnOrThrow(columnId);
  await wait();
  return clone(selectCardsByColumn(mockDb, columnId));
};

export const getBoardDetail = async (boardId) => {
  getBoardOrThrow(boardId);
  return returnBoardSnapshot(boardId);
};

export const createColumn = async ({ boardId, title }) => {
  getBoardOrThrow(boardId);
  const normalizedTitle = title?.trim();
  if (!normalizedTitle) throw new Error('Column title is required');

  const nextPosition = selectColumnsByBoard(mockDb, boardId).length;
  const columnId = generateId('column');

  mockDb.columns[columnId] = {
    id: columnId,
    boardId,
    title: normalizedTitle,
    position: nextPosition,
  };

  reindexColumnsByBoard(mockDb, boardId);
  return returnBoardSnapshot(boardId);
};

export const updateColumn = async ({ boardId, columnId, patch }) => {
  getBoardOrThrow(boardId);
  const column = getColumnOrThrow(columnId);
  ensureColumnBelongsToBoard(column, boardId);

  if (patch.title !== undefined) {
    const normalizedTitle = patch.title.trim();
    if (!normalizedTitle) throw new Error('Column title is required');
    column.title = normalizedTitle;
  }

  return returnBoardSnapshot(boardId);
};

export const deleteColumn = async ({ boardId, columnId }) => {
  getBoardOrThrow(boardId);
  const column = getColumnOrThrow(columnId);
  ensureColumnBelongsToBoard(column, boardId);

  delete mockDb.columns[columnId];

  Object.values(mockDb.cards).forEach((card) => {
    if (card.columnId === columnId) {
      delete mockDb.cards[card.id];
    }
  });

  reindexColumnsByBoard(mockDb, boardId);
  return returnBoardSnapshot(boardId);
};

export const createCard = async ({ boardId, columnId, payload }) => {
  getBoardOrThrow(boardId);
  const column = getColumnOrThrow(columnId);
  ensureColumnBelongsToBoard(column, boardId);

  const normalizedTitle = payload?.title?.trim();
  if (!normalizedTitle) throw new Error('Card title is required');

  const cardId = generateId('card');

  listCardIdsByColumn(columnId).forEach((existingCardId) => {
    mockDb.cards[existingCardId].position += 1;
  });

  mockDb.cards[cardId] = {
    id: cardId,
    columnId,
    position: 0,
    title: normalizedTitle,
    description: payload.description?.trim() || '',
    labels: payload.labels?.length ? payload.labels : ['info'],
    comments: payload.comments ?? 0,
    attachments: payload.attachments ?? 0,
    dueDate: payload.dueDate || '',
    assignee: payload.assignee || 'Unassigned',
  };

  return returnBoardSnapshot(boardId);
};

export const updateCard = async ({ boardId, cardId, patch }) => {
  getBoardOrThrow(boardId);
  const card = getCardOrThrow(cardId);
  const column = getColumnOrThrow(card.columnId);
  ensureColumnBelongsToBoard(column, boardId);

  if (patch.title !== undefined) {
    const normalizedTitle = patch.title.trim();
    if (!normalizedTitle) throw new Error('Card title is required');
    card.title = normalizedTitle;
  }

  if (patch.description !== undefined) card.description = patch.description;
  if (patch.labels !== undefined) card.labels = patch.labels;
  if (patch.comments !== undefined) card.comments = Number(patch.comments) || 0;
  if (patch.attachments !== undefined) card.attachments = Number(patch.attachments) || 0;
  if (patch.dueDate !== undefined) card.dueDate = patch.dueDate;
  if (patch.assignee !== undefined) card.assignee = patch.assignee;

  return returnBoardSnapshot(boardId);
};

export const deleteCard = async ({ boardId, cardId }) => {
  getBoardOrThrow(boardId);
  const card = getCardOrThrow(cardId);
  const sourceColumn = getColumnOrThrow(card.columnId);
  ensureColumnBelongsToBoard(sourceColumn, boardId);

  const nextCardIds = listCardIdsByColumn(sourceColumn.id).filter((id) => id !== cardId);
  delete mockDb.cards[cardId];
  reindexCardsByCardIds(sourceColumn.id, nextCardIds);

  return returnBoardSnapshot(boardId);
};

export const moveCard = async ({ boardId, cardId, targetColumnId, targetIndex = 0 }) => {
  getBoardOrThrow(boardId);

  const card = getCardOrThrow(cardId);
  const sourceColumn = getColumnOrThrow(card.columnId);
  const targetColumn = getColumnOrThrow(targetColumnId);

  ensureColumnBelongsToBoard(sourceColumn, boardId);
  ensureColumnBelongsToBoard(targetColumn, boardId);

  const sourceCardIds = listCardIdsByColumn(sourceColumn.id).filter((id) => id !== cardId);

  if (sourceColumn.id === targetColumn.id) {
    const safeIndex = Math.max(0, Math.min(targetIndex, sourceCardIds.length));
    sourceCardIds.splice(safeIndex, 0, cardId);
    reindexCardsByCardIds(sourceColumn.id, sourceCardIds);
    return returnBoardSnapshot(boardId);
  }

  const targetCardIds = listCardIdsByColumn(targetColumn.id);
  const safeIndex = Math.max(0, Math.min(targetIndex, targetCardIds.length));
  targetCardIds.splice(safeIndex, 0, cardId);

  reindexCardsByCardIds(sourceColumn.id, sourceCardIds);
  reindexCardsByCardIds(targetColumn.id, targetCardIds);

  return returnBoardSnapshot(boardId);
};
