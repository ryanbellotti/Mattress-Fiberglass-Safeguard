export const getSeverityColor = (s?: string) => {
  switch(s?.toLowerCase()) {
    case 'high': case 'extreme': return 'text-danger';
    case 'medium': return 'text-yellow-500';
    default: return 'text-success';
  }
};
