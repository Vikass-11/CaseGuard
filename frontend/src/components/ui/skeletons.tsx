import { Card, CardHeader, CardContent } from "@/components/ui/card";

// If shadcn skeleton isn't installed, we use a basic fallback here
const BasicSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
);

export function CaseListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <BasicSkeleton className="h-5 w-1/3" />
            <BasicSkeleton className="h-4 w-1/4 mt-2" />
          </CardHeader>
          <CardContent>
            <BasicSkeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CaseDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full max-w-sm">
          <BasicSkeleton className="h-8 w-3/4" />
          <BasicSkeleton className="h-4 w-1/2" />
        </div>
        <div className="flex space-x-3">
          <BasicSkeleton className="h-10 w-32" />
          <BasicSkeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <BasicSkeleton className="h-12 w-full" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <BasicSkeleton className="h-4 w-full" />
              <BasicSkeleton className="h-4 w-5/6" />
              <BasicSkeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <BasicSkeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <BasicSkeleton className="h-12 w-full" />
              <BasicSkeleton className="h-12 w-full" />
              <BasicSkeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function BriefSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between">
        <BasicSkeleton className="h-10 w-32" />
        <div className="flex space-x-3">
          <BasicSkeleton className="h-10 w-32" />
          <BasicSkeleton className="h-10 w-32" />
        </div>
      </div>
      <Card>
        <CardHeader className="items-center">
          <BasicSkeleton className="h-8 w-64" />
          <BasicSkeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="p-8 space-y-4">
          <BasicSkeleton className="h-6 w-1/4 mb-4" />
          <BasicSkeleton className="h-4 w-full" />
          <BasicSkeleton className="h-4 w-full" />
          <BasicSkeleton className="h-4 w-5/6" />
          <BasicSkeleton className="h-6 w-1/4 mt-8 mb-4" />
          <BasicSkeleton className="h-4 w-full" />
          <BasicSkeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>
    </div>
  );
}
