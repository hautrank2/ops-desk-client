"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function AppBreadcrumb() {
  const pathname = usePathname();
  const pathnames = (pathname || "").split('/').filter((x) => x);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const href = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <div key={href} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
