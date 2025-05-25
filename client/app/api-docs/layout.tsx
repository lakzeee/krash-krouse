export const metadata = {
  title: 'API Documentation - OfCourse',
  description: 'Interactive API documentation for the OfCourse application',
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
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                ← Back to App
              </a>
              <a
                href="/api/graphql"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
              >
                GraphQL Playground
              </a>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
