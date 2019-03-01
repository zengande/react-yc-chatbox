export interface Menu {
    icon: string;
    text: string;
    link?: string;
    title?: string;
    disabled?: boolean;
    onClick?: () => boolean;
}