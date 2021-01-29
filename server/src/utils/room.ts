import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  countries,
  names,
  starWars,
} from 'unique-names-generator';

export function getRoomName() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals, countries, names, starWars],
    separator: '-',
    length: 3,
  });
}
