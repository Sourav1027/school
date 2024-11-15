import React from 'react';
import { Alert } from '@/components/ui/alert';
import { Icon } from '@/components/ui/icon';

interface DissmissableAlertProps {
    children: React.ReactNode;
    color?: 'success' | 'destructive' | 'primary' | 'secondary' | 'warning' | 'info';
    dismissible?: boolean;
}

const DissmissableAlert: React.FC<DissmissableAlertProps> = ({ children, color = 'info', dismissible = true }) => {
    return (
        <Alert color={color} dismissible={dismissible}>
            <div className="flex items-center gap-2">
                {color === 'success' && <Icon icon="akar-icons:double-check" className="w-5 h-5" />}
                {color === 'destructive' && <Icon icon="heroicons-outline:ban" className="w-5 h-5" />}
                <span>{children}</span>
            </div>
        </Alert>
    );
};

export default DissmissableAlert;
