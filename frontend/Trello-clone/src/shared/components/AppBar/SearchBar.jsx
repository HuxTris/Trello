import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';

function AppBarSearch() {
  return (
    <OutlinedInput
      size="small"
      placeholder="Search cards, members, labels..."
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.85)' }} fontSize="small" />
        </InputAdornment>
      }
      sx={(theme) => theme.trelloCustom.appBar.searchInput}
    />
  );
}

export default AppBarSearch;
