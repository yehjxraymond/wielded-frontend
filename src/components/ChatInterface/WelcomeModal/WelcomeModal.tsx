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
      <DialogContent>
        <DialogHeader className="font-semibold">
          Welcome to Wielded!
        </DialogHeader>
        <p>Check out this introduction video to get started.</p>

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
