const INITIAL_BOARDS = [
  {
    id: 'board-1',
    title: 'HuxTris Product Board',
    description: 'Sprint planning and delivery board',
  },
  {
    id: 'board-2',
    title: 'Marketing Campaign Board',
    description: 'Campaign execution and approvals',
  },
];

const INITIAL_COLUMNS = [
  { id: 'column-backlog', boardId: 'board-1', title: 'Backlog', position: 0 },
  { id: 'column-progress', boardId: 'board-1', title: 'In Progress', position: 1 },
  { id: 'column-done', boardId: 'board-1', title: 'Done', position: 2 },

  { id: 'column-ideas', boardId: 'board-2', title: 'Ideas', position: 0 },
  { id: 'column-review', boardId: 'board-2', title: 'Review', position: 1 },
];

const INITIAL_CARDS = [
  {
    id: 'card-1',
    columnId: 'column-backlog',
    position: 0,
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
    columnId: 'column-backlog',
    position: 1,
    title: 'Define API contract for board detail endpoint',
    description: 'Draft response schema with columns, cards, labels and activity feed.',
    labels: ['warning'],
    comments: 4,
    attachments: 0,
    dueDate: '2026-03-24',
    assignee: 'Backend Team',
  },
  {
    id: 'card-3',
    columnId: 'column-progress',
    position: 0,
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
    columnId: 'column-progress',
    position: 1,
    title: 'Build optimistic update for card reorder',
    description: 'Keep UI responsive while waiting for API confirmation.',
    labels: ['error'],
    comments: 3,
    attachments: 2,
    dueDate: '2026-03-25',
    assignee: 'Frontend Team',
  },
  {
    id: 'card-5',
    columnId: 'column-done',
    position: 0,
    title: 'Set up board color tokens for light and dark mode',
    description: 'Map palette tokens and validate text contrast.',
    labels: ['success'],
    comments: 2,
    attachments: 0,
    dueDate: '2026-03-20',
    assignee: 'Design System',
  },
  {
    id: 'card-6',
    columnId: 'column-ideas',
    position: 0,
    title: 'Landing page teaser video concept',
    description: 'Storyboard + CTA concept for release week.',
    labels: ['info'],
    comments: 1,
    attachments: 2,
    dueDate: '2026-03-29',
    assignee: 'Marketing Team',
  },
  {
    id: 'card-7',
    columnId: 'column-review',
    position: 0,
    title: 'Review campaign KPI dashboard',
    description: 'Finalize KPI events and reporting dimensions.',
    labels: ['warning'],
    comments: 2,
    attachments: 1,
    dueDate: '2026-03-30',
    assignee: 'Data Team',
  },
];

const sortByPosition = (a, b) => a.position - b.position;

const clone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

export const createInitialMockDb = () => ({
  boards: Object.fromEntries(INITIAL_BOARDS.map((board) => [board.id, clone(board)])),
  columns: Object.fromEntries(INITIAL_COLUMNS.map((column) => [column.id, clone(column)])),
  cards: Object.fromEntries(INITIAL_CARDS.map((card) => [card.id, clone(card)])),
});

export const selectBoards = (db) => Object.values(db.boards).map((board) => clone(board));

export const selectColumnsByBoard = (db, boardId) =>
  Object.values(db.columns)
    .filter((column) => column.boardId === boardId)
    .sort(sortByPosition)
    .map((column) => ({
      id: column.id,
      boardId: column.boardId,
      title: column.title,
      position: column.position,
    }));

export const selectCardsByColumn = (db, columnId) =>
  Object.values(db.cards)
    .filter((card) => card.columnId === columnId)
    .sort(sortByPosition)
    .map((card) => {
      const { position, ...rest } = card;
      return clone(rest);
    });

export const buildBoardTree = (db, boardId) => {
  const board = db.boards[boardId];
  if (!board) return null;

  const sortedColumns = selectColumnsByBoard(db, boardId);

  const columns = sortedColumns.map((column) => {
    const cards = selectCardsByColumn(db, column.id);

    return {
      id: column.id,
      title: column.title,
      cardOrderIds: cards.map((card) => card.id),
      cards,
    };
  });

  return {
    ...clone(board),
    columnOrderIds: sortedColumns.map((column) => column.id),
    columns,
  };
};

export const reindexColumnsByBoard = (db, boardId) => {
  selectColumnsByBoard(db, boardId).forEach((column, index) => {
    db.columns[column.id].position = index;
  });
};

export const reindexCardsByColumn = (db, columnId) => {
  selectCardsByColumn(db, columnId).forEach((card, index) => {
    db.cards[card.id].position = index;
  });
};
