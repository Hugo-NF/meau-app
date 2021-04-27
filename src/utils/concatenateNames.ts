export function concatenateNames(names : Array<string>) : string {
  return names.length === 2 ? names.join(' e ') : names.join(', ');
}
