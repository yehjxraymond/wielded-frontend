import { FunctionComponent } from "react";

export const TitleSeparator: FunctionComponent<{
  title: string;
}> = ({ title }) => {
  return (
    <div className="container my-20 lg:my-36">
      <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl text-center">
        {title}
      </h1>
    </div>
  );
};