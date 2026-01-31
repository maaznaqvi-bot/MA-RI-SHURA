
export interface ShuraMember {
  id: string;
  name: string;
  role: string;
  parentId?: string;
  description?: string;
  email?: string;
  phone?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface HierarchyNode extends ShuraMember {
  children?: HierarchyNode[];
}