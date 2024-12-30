export const renderTagColor = (status: string | boolean) => {
  if (status === 'active' || status === true || status === 'success' || status === 'completed') {
    return 'green';
  } else if (
    status === 'Inactive' ||
    status === false ||
    status === 'In Progress' ||
    status === 'error' ||
    status === 'not_started' ||
    status === 'cancelled' ||
    status === 'ex-employee' ||
    status === 'resigned' ||
    status === 'terminated'
  ) {
    return 'red';
  } else if (status === 'Resolved' || status === 'in_progress') {
    return 'orange';
  } else if (
    status === 'confirm' ||
    status === 'warning' ||
    status === 'pending' ||
    status === 'on_hold'
  ) {
    return 'yellow';
  } else if (status === 'info' || status === 'start' || status === 'started') {
    return 'blue';
  } else {
    return;
  }
};
