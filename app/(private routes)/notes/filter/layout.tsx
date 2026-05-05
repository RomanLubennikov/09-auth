import { ReactNode } from "react";

export default function FilterLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      {sidebar}
      {children}
    </div>
  );
}
