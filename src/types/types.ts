import type { ToastActionElement } from '@/components/ui/toast';
import React from 'react';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content?: string;

  createdAt: string;
  updatedAt?: string;
  author?: string;
  type: 'article' | 'project' | 'resource';

  /** Main category */
  category?: ResourceCategory;
  /** Sub-subcategory for NATIONAL */
  subSubCategory?: NationalSubCategory; // <-- added this
  /** Sub category */
  subCategory?: ResourceSubCategory;

  fileType?: string;
  subTitle?: string;
  country?: string;
  imageUrl?: string;
  image?: string;
  language?: string;
}

export const typeLabels: Record<string, string> = {
  BLOG: 'Blog',
  NEWS: 'Actualité',
  TUTORIAL: 'Tutoriel',
  OPINION: 'Opinion',
  REVIEW: 'Critique',
};

export enum ResourceCategory {
  LEGAL = 'LEGAL',
  DATA = 'DATA',
  DIVERSE = 'DIVERSE',
  STUDIES = 'STUDIES',
}

export enum ResourceSubCategory {
  // LEGAL
  NATIONAL = 'NATIONAL',
  INTERNATIONAL = 'INTERNATIONAL',

  // DIVERSE
  CASE_LAW = 'CASE_LAW',
  OPINIONS = 'OPINIONS',
  OTHER = 'OTHER',
}

export enum NationalSubCategory {
  EMIRATES = 'EMIRATES',
  BAHRAIN = 'BAHRAIN',
  SAUDI_ARABIA = 'SAUDI_ARABIA',
  OMAN = 'OMAN',
  QATAR = 'QATAR',
  KUWAIT = 'KUWAIT',
}


export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastFunction = (
  props: Omit<ToasterToast, 'id'>
) => {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToasterToast>) => void;
};
