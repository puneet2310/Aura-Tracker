import { notification } from 'antd';
export const openNotification = (type, message) => {
    notification[type]({
        message: message,
        placement: 'top',
        style: {
            borderRadius: '12px',       // More rounded corners
            fontSize: '0.875rem',       // Small font for compactness
            width: '300px',             // Compact width
            padding: '16px 16px',       // Slim padding for a clean look
            fontFamily: 'Arial, sans-serif',  // Sharp, clean font
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
        },
    });
};