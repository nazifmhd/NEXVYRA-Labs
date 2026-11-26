/** Re-mounts on each navigation, giving a short, history-safe route transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
