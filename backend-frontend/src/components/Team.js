import Box from '@mui/material/Box';

export default function Team(props) {
  return (
    <Box display="flex" alignItems="center">
      <img src={props.badge} width="24" height="24" style={{ marginRight: '4px'}} />
      {props.name}
    </Box>
  );
}