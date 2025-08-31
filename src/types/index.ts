// src/types/index.ts
export interface BlinksMetadata {
    type: string;
    icon: string;
    title: string;
    description: string;
    label: string;
    links: {
      actions: Array<{
        label: string;
        href: string;
        parameters?: Array<{
          name: string;
          label: string;
          type: string;
          min?: string;
          max?: string;
          required?: boolean;
        }>;
      }>;
    };
  }
  
  export interface TransactionRequest {
    account: string;
  }
  
  export interface TransactionResponse {
    transaction: string;
    message: string;
  }