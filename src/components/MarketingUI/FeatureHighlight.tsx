import Image from "next/image";
import { FunctionComponent } from "react";

export const FeatureHighlight: FunctionComponent<{
  heading: string;
  subheading: string;
  description: string;
  imageUrl?: string;
  imageAlt: string;
}> = ({ heading, subheading, imageUrl, imageAlt, description }) => {
  return (
    <div className="container grid lg:grid-cols-2 gap-8 my-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-2 leading-8 text-muted-foreground text-sm">
          {subheading}
        </p>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
      <div>
        <Image
          src={imageUrl || "/assets/images/coming-soon.png"}
          alt={imageAlt}
          width={900}
          height={600}
          className="w-full rounded-md shadow-md"
        />
      </div>
    </div>
  );
};