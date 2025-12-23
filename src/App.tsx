import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ChatInterface } from "./components/ChatInterface";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Toaster />
        <Authenticated>
          <ChatInterface />
        </Authenticated>
        <Unauthenticated>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">AI Search Chat</h1>
                <p className="text-muted-foreground">Sign in to start searching and chatting</p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </div>
    </ThemeProvider>
  );
}
