import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useIntroduction } from "./useIntroduction";

const WelcomeModal: React.FC = () => {
  const { shouldShowIntroduction, dismissIntroduction } = useIntroduction();
  const [isDismissed, setIsDismissed] = useState(false);
  if (!shouldShowIntroduction) {
    return null;
  }

  return (
    <Dialog open={shouldShowIntroduction && !isDismissed}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="font-semibold">
          Welcome to Wielded!
        </DialogHeader>
        <p>Check out this introduction video to get started.</p>
        <iframe
          className="w-full h-96"
          src="https://www.youtube-nocookie.com/embed/2k0wNqepZ5Y?si=DRI0LibcFV9ChREG"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
        <DialogFooter>
          <Button
            size="sm"
            onClick={() => {
              dismissIntroduction();
              setIsDismissed(true);
            }}
          >
            Mark as completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
