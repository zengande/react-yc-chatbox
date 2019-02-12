export interface Menu {
    icon: string;
    text: string;
    link?: string;
    title?: string;
    onClick?: () => void;
}