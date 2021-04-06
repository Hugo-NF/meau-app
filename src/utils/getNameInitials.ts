export const getNameInitials = (name : string | undefined): string => {
  if (!name) return '';
  const names = name.split(' ');
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};
