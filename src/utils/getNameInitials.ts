export const getNameInitials = (name : string): string => {
  const names = name.split(' ');
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};
