import { createHmac } from 'node:crypto'

import { Ships } from "../../types/battles/airtable"; 
import { ensureUniqueVote, getPersonBySlackId } from './airtable';

export function signMatchup(matchup: { project1: Ships; project2: Ships; }, userSlackId: string): { project1: Ships; project2: Ships; signature: string, ts: number } {
  const secret = process.env.MATCHUP_SECRET
  if (!secret) throw new Error("No MATCHUP_SECRET env var set")
  if (secret.length < 32) throw new Error("MATCHUP_SECRET must be at least 32 characters long")
  const ts = Date.now()

  // Randomize the order of projects
  const [project1, project2] = Math.random() < 0.5 
    ? [matchup.project1, matchup.project2] 
    : [matchup.project2, matchup.project1];

  const matchupIDs = [project1.id, project2.id].sort()
  const objToSign = { ts, matchupIDs, userSlackId }
  const signature = createHmac("sha256", secret).update(JSON.stringify(objToSign)).digest('hex')

  return { project1, project2, ts, signature };
}

export function verifyMatchup(signedMatchup: { winner: string; loser: string; matchQuality: number, signature: string, ts: number }, userSlackId: string): boolean {
  const secret = process.env.MATCHUP_SECRET
  if (!secret) throw new Error("No MATCHUP_SECRET env var set")
  if (secret.length < 32) throw new Error("MATCHUP_SECRET must be at least 32 characters long")
  const tsNow = Date.now()
  const matchupIDs = [signedMatchup.winner, signedMatchup.loser].sort()
  const objToVerify = { ts: signedMatchup.ts, matchupIDs, userSlackId }

  const validSig = createHmac("sha256", secret).update(JSON.stringify(objToVerify)).digest('hex') === signedMatchup.signature
  const validTs = tsNow - signedMatchup.ts < 1000* 60 * 60 * 5 // 5 hours
  return validSig && validTs
}

/**
 * Generates a matchup between two projects for voting.
 * 
 * Process:
 * 1. Sort projects by matchup score (prioritizing less-matched projects).
 * 2. Select first project from top 20% of sorted projects.
 * 3. Filter valid matches based on hours similarity.
 */
export async function generateMatchup(
  projects: Ships[],
  userSlackId: string,
  attempts: number = 0
): Promise<{ project1: Ships; project2: Ships; signature: string; ts: number } | null> {
  if (attempts >= 5) {
    console.error("Failed to generate a unique matchup after 5 attempts");
    return null;
  }

  const user = await getPersonBySlackId(userSlackId);
  if (!user) return null;
  const userVotedShips = new Set(user.all_battle_ship_autonumbers || []);

  // First project selection
  const eligibleProjects = projects.filter(p => 
    !p.doubloon_payout && 
    !userVotedShips.has(p.autonumber?.toString()) && 
    p.entrant__slack_id[0] !== userSlackId
  );

  let project1: Ships;

  if (eligibleProjects.length > 0) {
    const sortedProjects = eligibleProjects.sort((a, b) => 
      new Date(a.ship_time).getTime() - new Date(b.ship_time).getTime()
    );
    const randomIndex = Math.floor(Math.pow(Math.random(), 2) * sortedProjects.length);
    project1 = sortedProjects[randomIndex];
  } else {
    project1 = projects.find(p => p.entrant__slack_id[0] !== userSlackId)!;
  }

  // Second project selection
  const paidProjects = projects.filter(p => 
    p.doubloon_payout && 
    p.entrant__slack_id[0] !== userSlackId && 
    p.id !== project1.id
  );

  const project2 = paidProjects.reduce((closest, current) => 
    Math.abs(current.total_hours - project1.total_hours) < Math.abs(closest.total_hours - project1.total_hours) 
      ? current 
      : closest
  );

  // Randomize order
  const [finalProject1, finalProject2] = Math.random() < 0.5 
    ? [project1, project2] 
    : [project2, project1];

  const uniqueVote = await ensureUniqueVote(userSlackId, finalProject1.id, finalProject2.id);
  if (!uniqueVote) {
    // If not a unique vote, recursively try again
    return generateMatchup(projects, userSlackId, attempts + 1);
  }

  return signMatchup({
    project1: finalProject1,
    project2: finalProject2,
  }, userSlackId);
}
