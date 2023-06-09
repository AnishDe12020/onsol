"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { createQR } from "@/lib/qr";
import { HTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { truncatePubkey } from "@/utils/truncate";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

interface PublicKeyDialogProps extends HTMLAttributes<HTMLButtonElement> {
  address: string;
}

const PublicKeyDialog = forwardRef<HTMLButtonElement, PublicKeyDialogProps>(
  ({ address, children, ...props }, ref) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={ref} {...props}>
            {children ?? "View Public Key"}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Public Key</DialogTitle>
            <DialogDescription>
              This is your google account wallet&apos;s public key. You can use
              this to receive crypto (SOL and other tokens) as well as NFTs.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center">
            <QRCode address={address} />

            <Button
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast.success("Copied to clipboard");
              }}
              variant="secondary"
              className="mt-6"
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              <span>{truncatePubkey(address)}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PublicKeyDialog.displayName = "PublicKeyDialog";

const QRCode = ({ address }: { address: string }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qr = createQR(address, 256, "#000000", "#ffffffc3");

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, [address]);

  return <div className="w-64 h-64" ref={qrRef} />;
};

export default PublicKeyDialog;
