import Box from '@mui/material/Box';

function BoardBar() {
    return (    
    <Box sx={{
        bgcolor: 'primary.dark',
        height: (theme) => theme.trelloCustom.boardBarHeight, 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
        Board Bar
    </Box>
    )
}

export default BoardBar