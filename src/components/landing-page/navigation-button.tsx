import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

type NavigationButtonProps = {
    direction: 'left' | 'right';
    onClick: () => void;
    disabled?: boolean;
    ariaLabel: string;
};

export const NavigationButton = ({ direction, onClick, disabled = false, ariaLabel }: NavigationButtonProps) => {
    const Icon = direction === 'left' ? ArrowLeft : ArrowRight;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm transition-all hover:bg-gold-50 hover:border-gold-200 hover:scale-110 ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white'
                }`}
            aria-label={ariaLabel}
        >
            <Icon size={16} weight="bold" className="text-stone-600" />
        </button>
    );
}; 