declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'set',
            targetId: string,
            config?: {
                page_path?: string;
                send_page_view?: boolean;
                [key: string]: unknown;
            }
        ) => void;
    }
}

export { };