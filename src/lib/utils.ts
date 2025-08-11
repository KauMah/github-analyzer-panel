import { ActionResult } from '@/actions/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unwrap<T>(result: ActionResult<T>): T {
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
}
