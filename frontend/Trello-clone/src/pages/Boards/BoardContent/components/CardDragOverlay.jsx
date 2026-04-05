import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function CardDragOverlay({ card }) {
  if (!card) return null;

  return (
    <Card
      variant="outlined"
      sx={{
        width: 280,
        borderRadius: 1.5,
        bgcolor: 'card.main',
        borderColor: 'rgba(9, 30, 66, 0.16)',
        boxShadow: '0 8px 20px rgba(9, 30, 66, 0.24)',
        transform: 'rotate(1.5deg)',
      }}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 0.75, flexWrap: 'wrap' }}>
          {(card.labels || []).map((label) => (
            <Box
              key={`${card.id}-${label}`}
              sx={{
                width: 36,
                height: 8,
                borderRadius: 99,
                bgcolor: `${label}.main`,
              }}
            />
          ))}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {card.title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CardDragOverlay;
