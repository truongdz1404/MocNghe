import {
    Typography as MTTypography,
    Button as MTButton,
    Input as MTInput,
    Card as MTCard,
    CardHeader as MTCardHeader,
    CardBody as MTCardBody,
    CardFooter as MTCardFooter,
    IconButton as MTIconButton,
    Step as MTStep,
    Stepper as MTStepper,
    Chip as MTChip,
    Tabs as MTTabs,
    TabsHeader as MTTabsHeader,
    Tab as MTTab,
    Avatar as MTAvatar,
    Tooltip as MTTooltip,
    // Import types
    TypographyProps,
    ButtonProps,
    InputProps,
    CardProps,
    IconButtonProps,
    StepperProps,
    ChipProps,
    TabsProps,
    TabsHeaderProps,
    TabProps,
    AvatarProps,
    TooltipProps,
    // Export components that don't need wrapping
    Badge,
    CardBodyProps,
    CardHeaderProps,
    CardFooterProps,
    Spinner as MTSpinner,
    Checkbox as MTCheckbox,
    Alert as MTAlert,
    Menu as MTMenu,
    MenuHandler as MTMenuHandler,
    MenuList as MTMenuList,
    MenuItem as MTMenuItem,
    SpinnerProps,
    AlertProps,
    MenuProps,
    MenuHandlerProps,
    MenuItemProps,
    MenuListProps,
    CheckboxProps,
} from '@material-tailwind/react';
import { StepProps } from '@material-tailwind/react/components/Stepper/Step';

// Typography wrapper


export const Spinner = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: SpinnerProps & { onPointerEnterCapture?: () => void; onPointerLeaveCapture?: () => void; }) => (
    <MTSpinner
        {...props}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
    />
  );
export const Checkbox = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    crossOrigin = "",
    ...props
}: CheckboxProps & { onPointerEnterCapture?: () => void;
     onPointerLeaveCapture?: () => void;
        crossOrigin?: string; }) => (
    <MTCheckbox
        {...props}
        crossOrigin={crossOrigin}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
    />
  );
// Alert wrapper
export const Alert = ({
    onPointerEnterCapture,
    onPointerLeaveCapture,
    placeholder,
    ...props
}: AlertProps & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTAlert
        {...props}
        {...(placeholder && { placeholder })}
        {...(onPointerEnterCapture && { onPointerEnterCapture })}
        {...(onPointerLeaveCapture && { onPointerLeaveCapture })}
    />
);

// Menu wrappers (no placeholder support)
export const Menu = (props: MenuProps) => <MTMenu {...props} />;
export const MenuHandler = (props: MenuHandlerProps) => <MTMenuHandler {...props} />;
export const MenuList = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<MenuListProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTMenuList
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);


export const MenuItem = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<MenuItemProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
}) => (
    <MTMenuItem
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...(props as Omit<React.ComponentProps<typeof MTMenuItem>, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'>)}
    />
);
export const Typography = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<TypographyProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTTypography
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Button wrapper
export const Button = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<ButtonProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTButton
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Input wrapper
export const Input = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    crossOrigin = "",
    ...props
}: Omit<InputProps, 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'crossOrigin'> & {
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
    crossOrigin?: string;
}) => (
    <MTInput
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        crossOrigin={crossOrigin}
        {...props}
    />
);

// Card wrapper
export const Card = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<CardProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTCard
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// CardHeader wrapper
export const CardHeader = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<CardHeaderProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTCardHeader
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// CardBody wrapper
export const CardBody = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<CardBodyProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTCardBody
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// CardFooter wrapper
export const CardFooter = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<CardFooterProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTCardFooter
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// IconButton wrapper
export const IconButton = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<IconButtonProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTIconButton
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Step wrapper
export const Step = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<StepProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTStep
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Stepper wrapper
export const Stepper = ({
    placeholder = "",
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<StepperProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTStepper
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Chip wrapper - Chip doesn't support placeholder
export const Chip = (props: ChipProps) => (
    <MTChip {...props} />
);

// Tabs wrapper - Tabs doesn't support placeholder
export const Tabs = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<TabsProps, 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTTabs
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// TabsHeader wrapper
export const TabsHeader = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    placeholder = "",
    ...props
}: Omit<TabsHeaderProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTTabsHeader
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Tab wrapper
export const Tab = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    placeholder = "",
    ...props
}: Omit<TabProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    onPointerEnterCapture?: () => void;
        placeholder?: string;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTTab
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Avatar wrapper - Avatar doesn't support placeholder
export const Avatar = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    placeholder = "",
    ...props
}: Omit<AvatarProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    onPointerEnterCapture?: () => void;
    placeholder?: string;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTAvatar
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Tooltip wrapper - Tooltip doesn't support placeholder
export const Tooltip = ({
    onPointerEnterCapture = () => { },
    onPointerLeaveCapture = () => { },
    ...props
}: Omit<TooltipProps, 'onPointerEnterCapture' | 'onPointerLeaveCapture'> & {
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
}) => (
    <MTTooltip
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        {...props}
    />
);

// Export components that don't need wrapping
export { Badge };