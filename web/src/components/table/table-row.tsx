import { ComponentProps } from "react";

interface TableRowProps extends ComponentProps<"tr"> {}

export function TableRow(props: TableRowProps) {
  return (
    <tr
      className="border-b border-white/10 hover:bg-white/10 transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
      {...props}
    />
  );
}
