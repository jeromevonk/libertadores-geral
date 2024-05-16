import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import StandingsTable from '../components/StandingsTable';
import { matchesService, standingsService } from 'src/services';
import { withRouter } from 'next/router'

export async function getServerSideProps() {
  const matches = await matchesService.getMatches();

  return {
    props: {
      matches
    },
  }
}

function Index(props) {

  const { matches } = props;

  // -----------------------------------------------------
  // Get standings
  // -----------------------------------------------------
  const standings = standingsService.getStandings(matches);

  return (
    <Container
      maxWidth="xl"
      sx={{ paddingLeft: '12px', paddingRight: '12px' }}
    >
      <Box sx={{ my: 2 }}>
        <Stack spacing={1}>
          {
            <Stack spacing={1}>
              <StandingsTable
                data={standings}
              />
            </Stack>
          }
        </Stack>
      </Box>
    </Container>
  );
}

export default withRouter(Index)
