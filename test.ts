import { GLOBAL_TEAMS, WORLD_CUP_EDITIONS } from './src/data/worldcups';

const missing = new Set();
WORLD_CUP_EDITIONS.forEach(ed => {
  if (ed.winnerId !== 'unknown' && !GLOBAL_TEAMS[ed.winnerId]) missing.add('winnerId: ' + ed.winnerId);
  if (ed.runnerUpId !== 'unknown' && !GLOBAL_TEAMS[ed.runnerUpId]) missing.add('runnerUpId: ' + ed.runnerUpId);
  
  ed.groups.forEach(g => {
    g.teams.forEach(t => {
      if (!GLOBAL_TEAMS[t.id]) missing.add('groupTeam: ' + t.id);
    });
  });

  ed.historicalKnockouts.forEach(hk => {
    if (!GLOBAL_TEAMS[hk.team1Id]) missing.add('hk.team1Id: ' + hk.team1Id);
    if (!GLOBAL_TEAMS[hk.team2Id]) missing.add('hk.team2Id: ' + hk.team2Id);
    if (!GLOBAL_TEAMS[hk.winnerId]) missing.add('hk.winnerId: ' + hk.winnerId);
  });
});

console.log("Missing teams:", Array.from(missing));
