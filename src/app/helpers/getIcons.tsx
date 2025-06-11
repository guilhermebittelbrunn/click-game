import { LuMousePointerClick } from 'react-icons/lu';
import { FaRobot } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';

export function getIcon(name: string) {
    switch (name) {
        case 'Cursor':
            return <LuMousePointerClick size={32} />;
        case 'Auto':
            return <FaRobot size={32} />;
        case 'Money':
            return <FaMoneyBillTrendUp size={32} />;
    }
}
