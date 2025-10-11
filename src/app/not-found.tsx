import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-primary/20 dark:text-primary/30">
            404
          </h1>
          <h2 className="text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            Oops! The page you are looking for does not exist.
          </p>
          <p className="text-sm text-muted-foreground">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="pt-8">
          <div className="w-24 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
}