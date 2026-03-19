const MOCK_DELAY = 250;

const wait = (ms = MOCK_DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const buildInitialBoard = () => ({
  id: 'board-1',
  title: 'HuxTris Product Board',
  description: 'Sprint planning and delivery board',
  columns: [
    {
      id: 'column-backlog',
      title: 'Backlog',
      cards: [
        {
          id: 'card-1',
          title: 'Polish board header for mobile and desktop',
          description: 'Align icon spacing and make sure text truncation is consistent.',
          labels: ['info'],
          comments: 2,
          attachments: 1,
          dueDate: '2026-03-23',
          assignee: 'Dev Team',
        },
        {
          id: 'card-2',
          title: 'Define API contract for board detail endpoint',
          description: 'Draft response schema with columns, cards, labels and activity feed.',
          labels: ['warning'],
          comments: 4,
          attachments: 0,
          dueDate: '2026-03-24',
          assignee: 'Backend Team',
        },
      ],
    },
    {
      id: 'column-progress',
      title: 'In Progress',
      cards: [
        {
          id: 'card-3',
          title: 'Implement drag and drop between columns',
          description: 'Support column reorder and card reorder interactions.',
          labels: ['secondary'],
          comments: 8,
          attachments: 5,
          dueDate: '2026-03-26',
          assignee: 'Frontend Team',
        },
        {
          id: 'card-4',
          title: 'Build optimistic update for card reorder',
          description: 'Keep UI responsive while waiting for API confirmation.',
          labels: ['error'],
          comments: 3,
          attachments: 2,
          dueDate: '2026-03-25',
          assignee: 'Frontend Team',
        },
      ],
    },
    {
      id: 'column-done',
      title: 'Done',
      cards: [
        {
          id: 'card-5',
          title: 'Set up board color tokens for light and dark mode',
          description: 'Map palette tokens and validate text contrast.',
          labels: ['success'],
          comments: 2,
          attachments: 0,
          dueDate: '2026-03-20',
          assignee: 'Design System',
        },
      ],
    },
  ],
});

const mockDb = {
  boards: {
    'board-1': buildInitialBoard(),
  },
};

const getBoardOrThrow = (boardId) => {
  const board = mockDb.boards[boardId];
  if (!board) {
    throw new Error(`Board ${boardId} not found`);
  }
  return board;
};

const getColumnOrThrow = (board, columnId) => {
  const column = board.columns.find((item) => item.id === columnId);
  if (!column) {
    throw new Error(`Column ${columnId} not found`);
  }
  return column;
};

const getCardOrThrow = (board, cardId) => {
  for (const column of board.columns) {
    const card = column.cards.find((item) => item.id === cardId);
    if (card) {
      return { card, column };
    }
  }
  throw new Error(`Card ${cardId} not found`);
};

const returnBoardSnapshot = async (board) => {
  await wait();
  return clone(board);
};

export const getBoardDetail = async (boardId) => {
  const board = getBoardOrThrow(boardId);
  return returnBoardSnapshot(board);
};

export const createColumn = async ({ boardId, title }) => {
  const board = getBoardOrThrow(boardId);
  const normalizedTitle = title?.trim();
  if (!normalizedTitle) {
    throw new Error('Column title is required');
  }

  board.columns.push({
    id: generateId('column'),
    title: normalizedTitle,
    cards: [],
  });

  return returnBoardSnapshot(board);
};

export const updateColumn = async ({ boardId, columnId, patch }) => {
  const board = getBoardOrThrow(boardId);
  const column = getColumnOrThrow(board, columnId);

  if (patch.title !== undefined) {
    const normalizedTitle = patch.title.trim();
    if (!normalizedTitle) throw new Error('Column title is required');
    column.title = normalizedTitle;
  }

  return returnBoardSnapshot(board);
};

export const deleteColumn = async ({ boardId, columnId }) => {
  const board = getBoardOrThrow(boardId);
  board.columns = board.columns.filter((item) => item.id !== columnId);
  return returnBoardSnapshot(board);
};

export const createCard = async ({ boardId, columnId, payload }) => {
  const board = getBoardOrThrow(boardId);
  const column = getColumnOrThrow(board, columnId);

  const normalizedTitle = payload?.title?.trim();
  if (!normalizedTitle) throw new Error('Card title is required');

  column.cards.unshift({
    id: generateId('card'),
    title: normalizedTitle,
    description: payload.description?.trim() || '',
    labels: payload.labels?.length ? payload.labels : ['info'],
    comments: payload.comments ?? 0,
    attachments: payload.attachments ?? 0,
    dueDate: payload.dueDate || '',
    assignee: payload.assignee || 'Unassigned',
  });

  return returnBoardSnapshot(board);
};

export const updateCard = async ({ boardId, cardId, patch }) => {
  const board = getBoardOrThrow(boardId);
  const { card } = getCardOrThrow(board, cardId);

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

  return returnBoardSnapshot(board);
};

export const deleteCard = async ({ boardId, cardId }) => {
  const board = getBoardOrThrow(boardId);
  board.columns.forEach((column) => {
    column.cards = column.cards.filter((item) => item.id !== cardId);
  });
  return returnBoardSnapshot(board);
};

export const moveCard = async ({ boardId, cardId, targetColumnId, targetIndex = 0 }) => {
  const board = getBoardOrThrow(boardId);
  const { card, column: sourceColumn } = getCardOrThrow(board, cardId);
  const targetColumn = getColumnOrThrow(board, targetColumnId);

  sourceColumn.cards = sourceColumn.cards.filter((item) => item.id !== cardId);

  const safeIndex = Math.max(0, Math.min(targetIndex, targetColumn.cards.length));
  targetColumn.cards.splice(safeIndex, 0, card);

  return returnBoardSnapshot(board);
};
