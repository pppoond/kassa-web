export interface SystemStatus {
    isSetupCompleted: boolean;
}

export interface SetupData {
    organizationName: string;
    branchName: string;
    branchAddress?: string;
    adminUsername: string;
    adminPassword?: string;
    adminFullName: string;
    adminEmail?: string;
}
