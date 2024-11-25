export const renderTagColor = (status: string | boolean) => {
  if (status === 'Active' || status === true || status === 'Pending' || status === 'success') {
    return 'green';
  } else if (
    status === 'Inactive' ||
    status === false ||
    status === 'In Progress' ||
    status === 'error'
  ) {
    return 'red';
  } else if (status === 'Resolved') {
    return 'orange';
  } else if (status === 'confirm' || status === 'warning') {
    return '#faad14';
  } else if (status === 'info') {
    return '#1677ff';
  } else {
    return;
  }
};
