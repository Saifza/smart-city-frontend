// CustomToast.js
export const CustomToast = ({ severity, message }) => {
  const colors = {
    HIGH: '#ff4d4d',
    MEDIUM: '#ffa500',
    LOW: '#a0e6a0'
  };

  const icons = {
    HIGH: '🔴',
    MEDIUM: '🟠',
    LOW: '🟢'
  };

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: colors[severity] || '#ddd',
        borderRadius: '8px',
        color: '#000',
        fontWeight: 'bold',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}
    >
      <span style={{ fontSize: '20px' }}>{icons[severity] || '⚠️'}</span>
      <span>{message}</span>
    </div>
  );
};
