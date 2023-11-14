import { FunctionComponent } from "react";

export const NoPermission: FunctionComponent<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <div>
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-4 text-sm font-semibold text-accent-foreground">
        {description}
      </div>
    </div>
  );
};
