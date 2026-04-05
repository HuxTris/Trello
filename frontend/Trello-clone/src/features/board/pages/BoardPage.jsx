import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import AppBar from '@/shared/components/AppBar';
import boardApi from '@/features/board/api/boardApi';
import { DEFAULT_BOARD_ID } from '@/features/board/constants';
import BoardBar from '../components/BoardBar';
import BoardContent from '../components/BoardContent';

function BoardPage() {
  const [boardList, setBoardList] = useState([]);
  const [boardId, setBoardId] = useState(DEFAULT_BOARD_ID);
  const [boardTitle, setBoardTitle] = useState('');

  useEffect(() => {
    const loadBoards = async () => {
      const boards = await boardApi.getBoards();
      setBoardList(boards);

      if (!boards.some((board) => board.id === DEFAULT_BOARD_ID) && boards[0]?.id) {
        setBoardId(boards[0].id);
      }
    };

    loadBoards();
  }, []);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh'}}>
      <AppBar />
      <BoardBar
        boardTitle={boardTitle}
        boardList={boardList}
        boardId={boardId}
        onChangeBoard={setBoardId}
      />
      <BoardContent boardId={boardId} onBoardLoaded={setBoardTitle} />
    </Container>
  )
}

export default BoardPage