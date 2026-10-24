import React from 'react';

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-600">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-indigo-400 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-300 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      </div>

      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}
