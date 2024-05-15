export function calculateAge(dateOfBirth: Date): number {
  // Calculate the difference in milliseconds between the current date and the provided date of birth
  const differenceInMs = Date.now() - dateOfBirth.getTime();
  // Create a new Date object representing the difference in milliseconds and store it in the variable ageDate (age Date object)
  const ageDate = new Date(differenceInMs);

  // Calculate the absolute value of the difference in years between the ageDate object and the year 1970 (UNIX epoch)
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
