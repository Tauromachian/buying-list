import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";

export type BreadcrumbItem = {
  text: string;
  href?: string;
};

function BreadcrumbItemNode({
  breadcrumbItem,
}: {
  breadcrumbItem: BreadcrumbItem;
}): ReactNode {
  if (breadcrumbItem.href) {
    return (
      <Link href={breadcrumbItem.href} className="text-blue-500">
        {breadcrumbItem.text}
      </Link>
    );
  }

  return <span>{breadcrumbItem.text}</span>;
}

export function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItem[];
}) {
  const [breadcrumbEls, setBreadcrumbEls] = useState<ReactNode[]>([]);

  useEffect(() => {
    const els: ReactNode[] = [];

    els.push(
      <BreadcrumbItemNode breadcrumbItem={breadcrumbs[0]}></BreadcrumbItemNode>,
    );

    for (let i = 1; i < breadcrumbs.length; i++) {
      els.push(<div>/</div>);
      els.push(
        <BreadcrumbItemNode
          breadcrumbItem={breadcrumbs[i]}
        ></BreadcrumbItemNode>,
      );
    }

    setBreadcrumbEls(els);
  }, [breadcrumbs]);

  return (
    <div className="flex gap-5">
      {breadcrumbEls.map((breadcrumbEl) => breadcrumbEl)}
    </div>
  );
}
