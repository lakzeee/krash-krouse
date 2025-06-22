export const metadata = {
  title: "API Documentation - OfCourse",
  description: "Interactive API documentation for the OfCourse application",
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                OfCourse API
              </h1>
              <p className="text-sm text-muted-foreground">
                Interactive API Documentation
              </p>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
