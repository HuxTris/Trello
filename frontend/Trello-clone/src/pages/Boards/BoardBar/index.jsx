import Box from '@mui/material/Box';
import BoardBarLeft from './BoardBarLeft';
import BoardBarRight from './BoardBarRight';

function BoardBar({ boardTitle, boardList, boardId, onChangeBoard }) {
  return (
    <Box sx={(theme) => theme.trelloCustom.boardBar.root}>
      <BoardBarLeft
        boardTitle={boardTitle}
        boardList={boardList}
        boardId={boardId}
        onChangeBoard={onChangeBoard}
      />
      <BoardBarRight />
    </Box>
  );
}

export default BoardBar;
