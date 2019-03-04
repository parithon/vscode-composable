export interface ChatComponent {
    isConnected(): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onConnecting?: (extensionId: string) => void;
    onConnected?: (extensionId: string) => void;
    onDisconnected?: (extensionId: string) => void;
}
