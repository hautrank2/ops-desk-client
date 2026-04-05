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

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

// Map: parent segment → label to show instead of the ObjectId
const ID_LABEL_MAP: Record<string, string> = {
  assets: "Detail",
  tickets: "Detail",
  departments: "Detail",
  users: "Detail",
};

// Map: segment after ObjectId (e.g. "edit") → override label
const SUFFIX_LABEL_MAP: Record<string, string> = {
  edit: "Edit",
  new: "New",
};

function getLabel(segment: string, prevSegment?: string, nextSegment?: string): string {
  if (OBJECT_ID_RE.test(segment)) {
    // If next segment is "edit", skip the id segment entirely (handled by next)
    if (nextSegment && SUFFIX_LABEL_MAP[nextSegment]) return "";
    const base = prevSegment ? (ID_LABEL_MAP[prevSegment] ?? "Detail") : "Detail";
    return base;
  }
  if (SUFFIX_LABEL_MAP[segment]) {
    return SUFFIX_LABEL_MAP[segment];
  }
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = (pathname || "").split('/').filter(Boolean);

  // Build crumb list, skipping empty labels (ObjectId before "edit")
  const crumbs: { label: string; href: string }[] = [];

  segments.forEach((seg, i) => {
    const prev = segments[i - 1];
    const next = segments[i + 1];
    const label = getLabel(seg, prev, next);
    if (!label) return; // skip hidden segments

    const href = '/' + segments.slice(0, i + 1).join('/');

    // If this is "edit" after an ObjectId, use the parent entity name + " Edit"
    if (SUFFIX_LABEL_MAP[seg] && prev && OBJECT_ID_RE.test(prev)) {
      const entity = segments[i - 2];
      const entityLabel = entity
        ? entity.charAt(0).toUpperCase() + entity.slice(1, -1) // e.g. "assets" → "Asset"
        : "";
      crumbs.push({ label: `Edit ${entityLabel}`, href });
      return;
    }

    // If this is an ObjectId without a suffix, show "entity Detail"
    if (OBJECT_ID_RE.test(seg)) {
      const entity = prev
        ? prev.charAt(0).toUpperCase() + prev.slice(1, -1)
        : "";
      crumbs.push({ label: `${entity} Detail`, href });
      return;
    }

    crumbs.push({ label, href });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <div key={crumb.href} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
