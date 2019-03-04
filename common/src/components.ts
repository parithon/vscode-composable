export interface ChatComponent {
  isConnected(): boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  onConnecting?: () => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}