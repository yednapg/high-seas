import { Ships } from "../../types/battles/airtable"; 

const HOUR_VARIATION_THRESHOLD = 0.5;
const PROBABILITY_SCALE = 50;

function calculateMatchProbability(hours1: number, hours2: number): number {
  const diff = Math.abs(hours1 - hours2);
  return Math.exp(-(diff * diff) / (2 * PROBABILITY_SCALE * PROBABILITY_SCALE));
}

function hoursWithinRange(hours1: number, hours2: number): boolean {
  const maxHours = Math.max(hours1, hours2);
  const minHours = Math.min(hours1, hours2);
  return (maxHours - minHours) / minHours <= HOUR_VARIATION_THRESHOLD;
}

export function signMatchup(matchup: { project1: Ships; project2: Ships; matchQuality: number }, userSlackId: string): { project1: Ships; project2: Ships; matchQuality: number, signature: string, ts: number } {
  const secret = process.env.MATCHUP_SECRET
  const ts = Date.now()
  const matchupIDs = [matchup.project1.id, matchup.project2.id].sort()
  const objToSign = { ts, matchupIDs, userSlackId }
  const signature = require('node:crypto').createHmac("sha256", secret).update(JSON.stringify(objToSign)).digest('hex')

  return { ...matchup, ts, signature };
}

export function verifyMatchup(signedMatchup: { project1: Ships; project2: Ships; matchQuality: number, signature: string, ts: number }, userSlackId: string): boolean {
  const secret = process.env.MATCHUP_SECRET
  const ts = Date.now()
  const matchupIDs = [signedMatchup.project1.id, signedMatchup.project2.id].sort()
  const objToVerify = { ts: signedMatchup.ts, matchupIDs, userSlackId }

  const validSig = require('node:crypto').createHmac("sha256", secret).update(JSON.stringify(objToVerify)).digest('hex') === signedMatchup.signature
  const validTs = ts - signedMatchup.ts < 1000* 60 * 60 * 5 // 5 hours
  return validSig && validTs
}

export function generateMatchup(
  projects: Ships[],
  userSlackId: string,
): { project1: Ships; project2: Ships; matchQuality: number; signature: string } | null {
  const shuffledProjects = projects.sort(() => Math.random() - 0.5);
  const project1 = shuffledProjects[0];

  const validMatches = shuffledProjects
    .slice(1)
    .filter((p) => hoursWithinRange(project1.hours, p.hours));

  if (validMatches.length === 0) return null;

  const probabilities = validMatches.map((p) =>
    calculateMatchProbability(project1.hours, p.hours),
  );
  const totalProbability = probabilities.reduce((a, b) => a + b, 0);
  const normalizedProbabilities = probabilities.map(
    (p) => p / totalProbability,
  );

  const randomValue = Math.random();
  let cumulativeProbability = 0;
  let project2Index = 0;

  for (let i = 0; i < normalizedProbabilities.length; i++) {
    cumulativeProbability += normalizedProbabilities[i];
    if (randomValue <= cumulativeProbability) {
      project2Index = i;
      break;
    }
  }

  const project2 = validMatches[project2Index];
  const matchQuality =
    1 /
    (1 +
      Math.abs(project1.hours - project2.hours) /
        Math.max(project1.hours, project2.hours));

  return signMatchup({ project1, project2, matchQuality }, userSlackId);
}