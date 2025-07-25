import {
    // Textarea as MTTextarea,
    Select as MTSelect,
    Option as MTOption,
    // TextareaProps,
    SelectProps,
} from '@material-tailwind/react';
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
    Dialog as MTDialog,
    DialogHeader as MTDialogHeader,
    DialogBody as MTDialogBody,
    DialogFooter as MTDialogFooter,
    // Import types
    TypographyProps,
    ButtonProps,
    // InputProps,
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
    DialogProps,
    DialogHeaderProps,
    DialogBodyProps,
    DialogFooterProps,
} from '@material-tailwind/react';
// Dialog wrapper
export const Dialog = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<DialogProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTDialog
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

export const DialogHeader = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<DialogHeaderProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTDialogHeader
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

export const DialogBody = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<DialogBodyProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTDialogBody
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

export const DialogFooter = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<DialogFooterProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTDialogFooter
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);
import { StepProps } from '@material-tailwind/react/components/Stepper/Step';


// export const Textarea = ({
// placeholder = "",
//     onPointerEnterCapture = undefined,
//     onPointerLeaveCapture = undefined,
//     onResize = () => { },
//     onResizeCapture = () => { },
//     ref: textareaRef, // Add this line
//     ...props
// }: Omit<TextareaProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
//     placeholder?: string;
//     onPointerEnterCapture?: React.PointerEventHandler<HTMLTextAreaElement>;
//     onPointerLeaveCapture?: React.PointerEventHandler<HTMLTextAreaElement>;
//     onResize?: React.UIEventHandler<HTMLElement>;
//     onResizeCapture?: React.UIEventHandler<HTMLElement>;
//     ref?: React.Ref<HTMLTextAreaElement>; // Add this line
// }) => (
//     <MTTextarea
//         placeholder={placeholder}
//         onPointerEnterCapture={onPointerEnterCapture}
//         onPointerLeaveCapture={onPointerLeaveCapture}
//         onResize={onResize}
//         onResizeCapture={onResizeCapture}
//         ref={textareaRef} // Update this line
//         {...props}
//     />
// );

// Select wrapper
export const Select = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<SelectProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTSelect
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// Option wrapper
export const Option = ({
    value = "",
    children,
    ...props
}: React.ComponentProps<typeof MTOption> & { value?: string; children?: React.ReactNode }) => (
    <MTOption value={value} {...props}>{children}</MTOption>
);


export const Spinner = ({
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: SpinnerProps & {
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTSpinner
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);
export const Checkbox = ({
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    crossOrigin = "",
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: CheckboxProps & {
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    crossOrigin?: string;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTCheckbox
        crossOrigin={crossOrigin}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);
// Alert wrapper
export const Alert = ({
    ...props
}: AlertProps) => (
    <MTAlert
        {...props}
    />
);

// Menu wrappers (no placeholder support)
export const Menu = (props: MenuProps) => <MTMenu {...props} />;
export const MenuHandler = (props: MenuHandlerProps) => <MTMenuHandler {...props} />;
export const MenuList = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<MenuListProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTMenuList
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
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
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<TypographyProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTTypography
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// Button wrapper
export const Button = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<ButtonProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTButton
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// Input wrapper
import { InputProps as MTInputProps } from "@material-tailwind/react";

export const Input = ({
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    crossOrigin = "",
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<MTInputProps, 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'crossOrigin' | 'onResize' | 'onResizeCapture'> & {
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    crossOrigin?: string;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTInput
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        crossOrigin={crossOrigin || undefined}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);
// Card wrapper
export const Card = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<CardProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTCard
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// CardHeader wrapper
export const CardHeader = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<CardHeaderProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTCardHeader
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// CardBody wrapper
export const CardBody = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<CardBodyProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTCardBody
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// CardFooter wrapper
export const CardFooter = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<CardFooterProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTCardFooter
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// IconButton wrapper
export const IconButton = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<IconButtonProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTIconButton
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// Step wrapper
export const Step = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<StepProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTStep
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// Stepper wrapper
export const Stepper = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<StepperProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTStepper
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
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
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<TabsHeaderProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTTabsHeader
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// Tab wrapper
export const Tab = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<TabProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTTab
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
        {...props}
    />
);

// Avatar wrapper - Avatar doesn't support placeholder
export const Avatar = ({
    placeholder = "",
    onPointerEnterCapture = undefined,
    onPointerLeaveCapture = undefined,
    onResize = () => { },
    onResizeCapture = () => { },
    ...props
}: Omit<AvatarProps, 'placeholder' | 'onPointerEnterCapture' | 'onPointerLeaveCapture' | 'onResize' | 'onResizeCapture'> & {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.UIEventHandler<HTMLElement>;
    onResizeCapture?: React.UIEventHandler<HTMLElement>;
}) => (
    <MTAvatar
        placeholder={placeholder}
        onPointerEnterCapture={onPointerEnterCapture}
        onPointerLeaveCapture={onPointerLeaveCapture}
        onResize={onResize}
        onResizeCapture={onResizeCapture}
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