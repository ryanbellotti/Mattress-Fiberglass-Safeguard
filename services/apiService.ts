export const saveAssessment = async (userId: string, data: any) => {
  try {
    const response = await fetch('/api/assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, data }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
};

export const getAssessment = async (userId: string) => {
  try {
    const response = await fetch(`/api/assessment/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching assessment:', error);
    throw error;
  }
};
