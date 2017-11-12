export function getYearDiff(birthDate) {
  const birthDateTime = new Date(birthDate).getTime();
  const presentTime = new Date().getTime();
  const diff = presentTime - birthDateTime;
  const diffYears = diff / 31536000000;
  return Math.trunc(diffYears);
}
