import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';


function App() {

  return (
    <>
    <div>Phan Huu Tri</div>
    <Button variant='text'>Text</Button>
    <Button variant='contained'>Contained</Button>
    <Button variant='outlined'>Outlined</Button>
    <Stack direction="row" spacing={3}>
      <Icon>add_circle</Icon>
      <Icon color="primary">add_circle</Icon>
      <Icon sx={{ color: green[500] }}>add_circle</Icon>
      <Icon fontSize="small">add_circle</Icon>
      <Icon sx={{ fontSize: 30 }}>add_circle</Icon>
    </Stack>
    </>
  )
}

export default App
