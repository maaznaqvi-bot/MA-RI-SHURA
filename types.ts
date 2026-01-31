
export interface ShuraMember {
  id: string;
  name: string;
  role: string;
  parentId?: string;
  description?: string;
  email?: string;
  phone?: string;
}

export interface HierarchyNode extends ShuraMember {
  children?: HierarchyNode[];
}

// Added ChatMessage interface to fix the import error in ChatInterface.tsx
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
