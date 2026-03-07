import { Loader2Icon } from "lucide-react"

import { cn } from "@/_utils/utils"

function Spinner({
  className,
  ...props
}) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props} />
  );
}

export { Spinner }

export function SpinnerCustom(){
  return (
    <div className="flex justify-center items-center gap-6">
      <Spinner className= "size-12" />
    </div>
  );
}

export function SpinnerCustomCart(){
  return (
    <div className="flex justify-center items-center gap-6">
      <Spinner className= "size-24" />
    </div>
  );
}
