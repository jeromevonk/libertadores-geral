import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Team from '../components/Team';
import { AppContext } from 'src/pages/_app';
import {
  getComparator,
} from 'src/helpers'


function StandingsTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
    largeScreen } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'rank',
      label: '',
    },
    {
      id: 'team',
      label: 'Team',
    },
    {
      id: 'points',
      label: 'P',
    },
    {
      id: 'matches',
      label: 'J',
    },
    {
      id: 'victories',
      label: 'V',
    },
    {
      id: 'draws',
      label: 'E',
    },
    {
      id: 'losses',
      label: 'D',
    },
    {
      id: 'goalsFor',
      label: 'GP',
      onlyLargeScreen: true,
    },
    {
      id: 'goalsAgainst',
      label: 'GC',
      onlyLargeScreen: true,
    },
    {
      id: 'goalDifference',
      label: 'SG',
    },
    {
      id: 'percent',
      label: '%',
      onlyLargeScreen: true,
    },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          if (!largeScreen.width && headCell.onlyLargeScreen) return;

          return (
            <TableCell
              key={headCell.id}
              align='center'
              padding='checkbox'
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{backgroundColor: headCell.backgroundColor }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                hideSortIcon='true'
                onClick={createSortHandler(headCell.id)}
                sx={{
                  flexDirection: 'row-reverse',
                }}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  );
}

StandingsTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  largeScreen: PropTypes.object.isRequired
};


export default function StandingsTable(props) {
  // Context
  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;

  // States
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('points');
  const [selected, setSelected] = React.useState([]);

  const rows = props.data || [];

  const CustomTableCell = styled(TableCell)({
    "borderLeft": '1px dotted grey',
  });

  // ----------------------------------------
  //  Button handlers
  // ----------------------------------------
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (_event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 250 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <StandingsTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              largeScreen={largeScreen}
            />
            <TableBody>
              {rows
                .sort(getComparator(order, orderBy))
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.team}
                    >
                      {
                        // Rank
                      }
                      <TableCell align="center">{index + 1}</TableCell>
                      {
                        // Team
                      }
                      <TableCell align="left"><Team name={largeScreen.width ? row.team : row.initials} badge={row.badge}/></TableCell>
                      {
                        // Points
                      }
                      <CustomTableCell align="center">{row.points}</CustomTableCell>
                      {
                        // Games
                      }
                      <CustomTableCell align="center">{row.matches}</CustomTableCell>
                      {
                        // Victories
                      }
                      <CustomTableCell align="center">{row.victories}</CustomTableCell>
                      {
                        // Draws
                      }
                      <CustomTableCell align="center">{row.draws}</CustomTableCell>
                      {
                        // Losses
                      }
                      <CustomTableCell align="center">{row.losses}</CustomTableCell>
                      {
                        // Goals for - only if largeScreen
                      }
                      {
                        largeScreen.width &&
                        <CustomTableCell align="center">{row.goalsFor}</CustomTableCell>
                      }
                      {
                        // Goals against - only if largeScreen
                      }
                      {
                        largeScreen.width &&
                        <CustomTableCell align="center">{row.goalsAgainst}</CustomTableCell>
                      }
                      {
                        // Goal difference
                      }
                      <CustomTableCell align="center">{row.goalDifference}</CustomTableCell>
                      {
                        // Percent - only if largeScreen
                      }
                      {
                        largeScreen.width &&
                        <CustomTableCell align="center">{row.percent}</CustomTableCell>
                      }
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

StandingsTable.propTypes = {
  data: PropTypes.array.isRequired
};