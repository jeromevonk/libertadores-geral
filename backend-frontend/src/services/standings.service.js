import { format } from 'date-fns'; 

export const standingsService = {
  getStandings,
};

function getStandings(matches) {
  
  // ---------------------------
  // Create empty standings
  // ---------------------------
  const standings = {};

  // If there are matches, iterate through
  if (Object.keys(matches).length !== 0) {
    iterateByRounds(standings, matches);

  }

  // Calculate percents
  for (const [key, value] of Object.entries(standings)) {
    standings[key].percent = value.matches == 0 ? 0 : Math.round((100 * value.points) / (value.matches * 3) * 10) / 10;
  }

  // Convert 
  return convertStandingsToArray(standings);
}

// -----------------------------------------------
// Iterate by round in crescent order
// -----------------------------------------------
function iterateByRounds(standings, matches) {
  const details = {
    startRound: 1,
    endRound: 6,
  }

  for (let i = details.startRound; i <= details.endRound; i++) {
    const round = matches[i];

    for (const match of round) {
      calculateMatch(standings, match)
    }
  }
}


// -----------------------------------------------
// Util
// -----------------------------------------------
function convertStandingsToArray(standings) {
  // Convert 
  const sorted = [];
  for (const [key, value] of Object.entries(standings)) {
    sorted.push({
      team: key,
      ...value
    })
  }

  return sorted;
}

function emptyStandings() {
  return { "points": 0, "pointsLost": 0, "matches": 0, "victories": 0, "draws": 0, "losses": 0, "goalsFor": 0, "goalsAgainst": 0, "goalDifference": 0, "percent": 0, "badge": "", "initials": "" }
}

function calculateMatch(standings, match) {
  const { homeTeam, awayTeam, homeScore, awayScore, started } = match;

  // Check if teams are already present in standings
  if (false == homeTeam in standings) {
    standings[homeTeam] = emptyStandings()
    standings[homeTeam].badge = match.homeTeamBadge
    standings[homeTeam].initials = match.homeTeamInitials
  } 
    
  if (false == awayTeam in standings) {
    standings[awayTeam] = emptyStandings()
    standings[awayTeam].badge = match.awayTeamBadge
    standings[awayTeam].initials = match.awayTeamInitials
  }

  if (started) {

    // The home team
    calculateStandings(standings[homeTeam], homeScore, awayScore)

    // The away team
    calculateStandings(standings[awayTeam], awayScore, homeScore)
  }
}

function getResults(score, oponentScore) {
  const results = {
    points: 0,
    pointsLost: 0,
    victory: 0,
    draw: 0,
    loss: 0,
    goalsFor: score,
    goalsAgainst: oponentScore,
    goalDifference: score - oponentScore
  }

  if (score > oponentScore) {
    results.points = 3
    results.victory = 1
  } else if (score == oponentScore) {
    results.points = 1
    results.pointsLost = 2
    results.draw = 1

  } else {
    results.pointsLost = 3
    results.loss = 1
  }

  return results;
}

function calculateStandings(team, score, oponentScore) {
  const results = getResults(score, oponentScore)
  team.matches += 1
  team.points += results.points
  team.pointsLost += results.pointsLost
  team.victories += results.victory
  team.draws += results.draw
  team.losses += results.loss
  team.goalsFor += results.goalsFor
  team.goalsAgainst += results.goalsAgainst
  team.goalDifference += results.goalDifference
}
