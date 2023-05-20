/* Example result:
 *
 * {
 *   "id": 237,
 *   "first_name": "LeBron",
 *   "height_feet": 6,
 *   "height_inches": 8,
 *   "last_name": "James",
 *   "position": "F",
 *   "team": {
 *     "id": 14,
 *     "abbreviation": "LAL",
 *     "city": "Los Angeles",
 *     "conference": "West",
 *     "division": "Pacific",
 *     "full_name": "Los Angeles Lakers",
 *     "name": "Lakers"
 *   },
 *   "weight_pounds": 250
 * }
 *
 */

// let's go babyyyyy
export interface LeBron {
    id: 237; // literal number
    first_name: string;
    last_name: string;
    height_feet: number;
    height_inches: number;
    weight_pounds: number;
    position: Position;
    team: Team;
}

export function isLeBron(maybeLeBron: unknown): maybeLeBron is LeBron {
    if (typeof maybeLeBron !== 'object') return false;

    const { id, position, team } = maybeLeBron as LeBron;

    return id === 237 && isPosition(position) && isTeam(team)
}

// THIS IS NOT VALIDATION but it's better than nothing and you'll see why
//      there are great libraries that do typescript validation
//          (zod is the one I reach for)
//
// Zod makes you learn a "third thing" in that they have a schema to learn
//      but the neat thing is that you get your types
//      for free thanks to some very nice magic

// Just for fun and Typescript practice:
interface Team {
    id: number;
    abbreviation: string;
    city: string;
    // these are union-able but that would require maintaining
    conference: string;
    division: string;
    full_name: string;
    name: string;
}

// contrived typeguard function example -- this is a very special return signature
//      this is just a spotcheck of a few different properties
//      you can do whatever you want -- use your best judgement
function isTeam(maybeTeam: unknown): maybeTeam is Team {
    if (typeof maybeTeam !== 'object') return false;

    // when you say 'as' you are overriding the inferred type of {}
    const { id, conference, division } = maybeTeam as Team;

    return typeof id === 'number' && typeof conference === 'string' && typeof division === 'string'
}

// this is better than a string enum in my experience
const Positions = ['C', 'G', 'F'] as const;
type Position = [typeof Positions][number];
function isPosition(maybePosition: unknown): maybePosition is Position {
    return Positions.some(p => p === maybePosition);
}
