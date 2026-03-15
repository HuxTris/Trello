import Box from '@mui/material/Box';
import BoardBarLeft from './BoardBarLeft';
import BoardBarRight from './BoardBarRight';

function BoardBar() {
  return (
    <Box sx={(theme) => theme.trelloCustom.boardBar.root}>
      <BoardBarLeft />
      <BoardBarRight />
    </Box>
  );
}

export default BoardBar;
