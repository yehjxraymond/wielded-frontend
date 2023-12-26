import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

export const FeatureHero: FunctionComponent<{
  heading: string;
  subheading: string;
  videoUrl: string;
  source?: string;
}> = ({ heading, subheading, videoUrl, source }) => {
  return (
    <div className="pt-10 lg:pt-20 pb-10 lg:pb-20 container grid lg:grid-cols-2 gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {heading}
        </h1>
        <p className="mt-10 text-lg leading-8 text-muted-foreground">
          {subheading}
        </p>
        <div className="space-x-4 my-10">
          <Link href={`/login?source=${source || "feature-hero"}`}>
            <Button>Get started</Button>
          </Link>
          <Link href={`/contact?source=${source || "feature-hero"}`}>
            <Button variant="secondary">Contact Sales</Button>
          </Link>
        </div>
      </div>
      <div>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="rounded-md shadow-lg"
            src={videoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export const FeatureHeroImage: FunctionComponent<{
  heading: string;
  subheading: string;
  imageUrl: string;
  imageAlt: string;
  source?: string;
}> = ({ heading, subheading, imageUrl, imageAlt, source }) => {
  return (
    <div className="pt-10 lg:pt-20 pb-10 lg:pb-20 container grid lg:grid-cols-2 gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {heading}
        </h1>
        <p className="mt-10 text-lg leading-8 text-muted-foreground">
          {subheading}
        </p>
        <div className="space-x-4 my-10">
          <Link href={`/login?source=${source || "feature-hero"}`}>
            <Button>Get started</Button>
          </Link>
          <Link href={`/contact?source=${source || "feature-hero"}`}>
            <Button variant="secondary">Contact Sales</Button>
          </Link>
        </div>
      </div>
      <div>
        <Image
          className="rounded-md shadow-lg"
          src={imageUrl}
          alt={imageAlt}
          width={900}
          height={600}
        />
      </div>
    </div>
  );
};
