// resources/js/types/inertia.d.ts

import { ReactNode } from 'react';
import { PageProps } from '@inertiajs/core';

export type InertiaPage<P = {}> = {
  (props: P): JSX.Element;
  layout?: (page: ReactNode) => JSX.Element;
};
