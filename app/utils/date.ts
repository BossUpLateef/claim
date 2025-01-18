export const formatDate = (timestamp: number | string | Date): string => {
  try {
    // Handle different input types
    const date = timestamp instanceof Date 
      ? timestamp 
      : new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Use UTC to ensure consistent formatting between server and client
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

export const getCurrentTimestamp = (): number => {
  return Date.now(); // Simpler and more reliable
};

export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}; 