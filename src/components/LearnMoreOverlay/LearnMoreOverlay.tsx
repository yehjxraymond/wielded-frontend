import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LibraryBig } from "lucide-react";
import { FunctionComponent } from "react";

const LearnMoreContent: FunctionComponent<{
  videoUrl: string;
  title: string;
}> = ({ title, videoUrl }) => {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader className="font-semibold">{title}</DialogHeader>
      <iframe
        className="w-full h-96"
        src={videoUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </DialogContent>
  );
};

export const LearnMoreOverlay: FunctionComponent<{
  title: string;
  videoUrl: string;
  className?: string;
}> = ({ videoUrl, title, className }) => {
  if (2 % 2 == 0) return null;
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div
          className={cn(
            "flex items-center py-1 w-full text-sm text-muted-foreground",
            className
          )}
        >
          <LibraryBig className="w-4 h-4 mr-1" /> {title}
        </div>
      </DialogTrigger>
      <LearnMoreContent videoUrl={videoUrl} title={title} />
    </Dialog>
  );
};
