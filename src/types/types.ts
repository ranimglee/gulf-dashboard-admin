import type { ToastActionElement } from '@/components/ui/toast';
import React from 'react';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'published' | 'draft';
  type: 'article' | 'project' | 'resource';
  category?: string;
  fileType?: string;
  subTitle?: string;
  country?: string;
  imageUrl?: string;
  image?: string;
}

export const typeLabels: Record<string, string> = {
  BLOG: 'Blog',
  NEWS: 'Actualité',
  TUTORIAL: 'Tutoriel',
  OPINION: 'Opinion',
  REVIEW: 'Critique',
};

export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastFunction = (props: Omit<ToasterToast, 'id'>) => {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToasterToast>) => void;
};