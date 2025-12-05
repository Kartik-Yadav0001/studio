export interface Emulator {
    name: 'Auth' | 'Firestore' | 'Functions' | 'Storage';
    port: number;
    uiPort: number;
    Icon: React.ElementType;
    description: string;
}
