export default function VisualizerLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-[calc(100vh-4rem)]">{children}</div>;
}
