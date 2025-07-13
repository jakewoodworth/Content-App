// src/App.jsx
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Home, Sparkles, History, Settings, LogOut, Loader2, Check, X } from 'lucide-react';

// Shadcn UI Components - These are defined inline for self-containment in this Canvas.
// In a real project, you would typically generate these using `npx shadcn-ui@latest add <component_name>`
// and import them from `components/ui/`.

// Button.jsx
export function Button({ children, className = '', variant = 'default', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className} px-4 py-2`} {...props}>
      {children}
    </button>
  );
}

// Input.jsx
export function Input({ className = '', type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

// Textarea.jsx
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

// Checkbox.jsx
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
export function Checkbox({ className = '', ...props }) {
  return (
    <CheckboxPrimitive.Root
      className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// Label.jsx
export function Label({ className = '', ...props }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}

// Card.jsx
export function Card({ className = '', ...props }) { return <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`} {...props} />; }
export function CardHeader({ className = '', ...props }) { return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />; }
export function CardTitle({ className = '', ...props }) { return <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />; }
export function CardDescription({ className = '', ...props }) { return <p className={`text-sm text-muted-foreground ${className}`} {...props} />; }
export function CardContent({ className = '', ...props }) { return <div className={`p-6 pt-0 ${className}`} {...props} />; }
export function CardFooter({ className = '', ...props }) { return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />; }

// Tabs.jsx
import * as TabsPrimitive from '@radix-ui/react-tabs';
export function Tabs({ className = '', ...props }) { return <TabsPrimitive.Root className={className} {...props} />; }
export function TabsList({ className = '', ...props }) { return <TabsPrimitive.List className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`} {...props} />; }
export function TabsTrigger({ className = '', ...props }) { return <TabsPrimitive.Trigger className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`} {...props} />; }
export function TabsContent({ className = '', ...props }) { return <TabsPrimitive.Content className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`} {...props} />; }

// Separator.jsx
import * as SeparatorPrimitive from '@radix-ui/react-separator';
export function Separator({ className = '', orientation = 'horizontal', decorative = true, ...props }) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={`shrink-0 bg-border ${orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'} ${className}`}
      {...props}
    />
  );
}

// ScrollArea.jsx
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
export function ScrollArea({ children, className, ...props }) {
  return (
    <ScrollAreaPrimitive.Root className={`relative overflow-hidden ${className}`} {...props}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
export function ScrollBar({ className, orientation = 'vertical', ...props }) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={`flex touch-none select-none transition-colors ${
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]'
      } ${orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]'} ${className}`}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

// Toaster.jsx - This is the component that renders the toasts.
// It's defined here for self-containment, but typically would be in `src/components/ui/toaster.jsx`.
import * as ToastPrimitive from '@radix-ui/react-toast';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={`fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] ${className}`}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export const Toast = React.forwardRef(({ className, variant, children, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full ${
      variant === "destructive"
        ? "destructive group"
        : variant === "success"
        ? "success group"
        : ""
    } ${className}`}
    {...props}
  >
    {children}
  </ToastPrimitive.Root>
));
Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive ${className}`}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

export const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={`absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 ${className}`}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

export const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={`text-sm font-semibold [&+div]:text-xs ${className}`}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={`text-sm opacity-90 ${className}`}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

// useToast.jsx - This is the hook to trigger toasts.
// It's defined here for self-containment, but typically would be in `src/components/ui/use-toast.jsx`.
const toastState = create(
  (set) => ({
    toasts: [],
    addToast: (toast) =>
      set((state) => ({ toasts: [...state.toasts, { id: Date.now(), ...toast }] })),
    removeToast: (id) =>
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  })
);

export function useToast() {
  const { toasts, addToast, removeToast } = toastState();

  const toast = ({ ...props }) => {
    addToast(props);
    // Auto-remove after a delay (e.g., 5 seconds)
    setTimeout(() => removeToast(props.id), props.duration || 5000);
  };

  return { toasts, toast };
}


// --- Global Variables (Simulated for this prompt) ---
// In a real application, these would be securely managed, e.g., via environment variables.
const __app_id = 'woodworth-ai-social-hub-v1';
const __firebase_config = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "YOUR_FIREBASE_API_KEY", // Replace with your actual Firebase API Key
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN", // Replace with your actual Firebase Auth Domain
  projectId: "YOUR_FIREBASE_PROJECT_ID", // Replace with your actual Firebase Project ID
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET", // Replace with your actual Firebase Storage Bucket
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID", // Replace with your actual Firebase Messaging Sender ID
  appId: "YOUR_FIREBASE_APP_ID" // Replace with your actual Firebase App ID
};
const __initial_auth_token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined; // Set a custom token here if you want to test with it initially

// --- Firebase Initialization ---
const app = initializeApp(__firebase_config);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Zustand Store for Global State ---
const useAppStore = create(
  persist(
    (set, get) => ({
      user: null,
      userId: null,
      userProfile: null,
      connectedAccounts: [],
      contentDrafts: [],
      postHistory: [],
      currentView: 'dashboard', // dashboard, generate, accounts, history
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, userId: user ? user.uid : null }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setConnectedAccounts: (accounts) => set({ connectedAccounts: accounts }),
      setContentDrafts: (drafts) => set({ contentDrafts: drafts }),
      setPostHistory: (history) => set({ postHistory: history }),
      setCurrentView: (view) => set({ currentView: view }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Firebase Operations (conceptual/simulated for frontend context)
      fetchUserProfile: async () => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          const docRef = doc(db, `artifacts/${__app_id}/users/${userId}/userProfiles`, userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            get().setUserProfile(docSnap.data());
          } else {
            // Set default profile if none exists
            const defaultProfile = {
              name: "Jake Woodworth",
              email: "jake@woodworth.ai",
              brandGuidelines: {
                name: "Jake Woodworth",
                agency: "Woodworth AI",
                dualFacets: {
                  entrepreneur: {
                    focus: "Jake's journey, mindset, leadership, adaptability, philosophy, broader business insights, growth strategies, personal development, the 'why' behind building things.",
                    tone: "Personal, reflective, inspiring, philosophical, passionate, authentic.",
                  },
                  aiExpert: {
                    focus: "Practical AI applications, automation strategies, solving specific business inefficiencies with AI, industry trends in AI, tangible benefits of AI solutions.",
                    tone: "Authoritative, practical, problem-solving, results-oriented, clear, concise.",
                  },
                },
                keyDifferentiators: "Young, driven, innately adaptable (military kid background), multifaceted thinker (philosopher, writer, psychologist, leader), authentic journey (AI interest grew organically), competitive drive ('will win,' 'love doing it').",
                corePhilosophy: "If there's time to be saved and resources to be conserved, why not?",
                overallTone: "Confident, approachable, enthusiastic, transparent, insightful, action-oriented.",
                mandatoryInclusion: "Always aim to provide value and maintain authenticity.",
              },
            };
            await setDoc(docRef, defaultProfile);
            get().setUserProfile(defaultProfile);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
          get().setError("Failed to fetch user profile.");
        } finally {
          get().setIsLoading(false);
        }
      },

      fetchConnectedAccounts: async () => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          const q = query(collection(db, `artifacts/${__app_id}/users/${userId}/connectedAccounts`));
          const querySnapshot = await getDocs(q);
          const accounts = [];
          querySnapshot.forEach((doc) => {
            accounts.push({ id: doc.id, ...doc.data() });
          });
          get().setConnectedAccounts(accounts);
        } catch (e) {
          console.error("Error fetching connected accounts:", e);
          get().setError("Failed to fetch connected accounts.");
        } finally {
          get().setIsLoading(false);
        }
      },

      fetchContentDrafts: async () => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          const q = query(collection(db, `artifacts/${__app_id}/users/${userId}/contentDrafts`));
          const querySnapshot = await getDocs(q);
          const drafts = [];
          querySnapshot.forEach((doc) => {
            drafts.push({ id: doc.id, ...doc.data() });
          });
          get().setContentDrafts(drafts);
        } catch (e) {
          console.error("Error fetching content drafts:", e);
          get().setError("Failed to fetch content drafts.");
        } finally {
          get().setIsLoading(false);
        }
      },

      fetchPostHistory: async () => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          const q = query(collection(db, `artifacts/${__app_id}/users/${userId}/postHistory`));
          const querySnapshot = await getDocs(q);
          const history = [];
          querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() });
          });
          get().setPostHistory(history);
        } catch (e) {
          console.error("Error fetching post history:", e);
          get().setError("Failed to fetch post history.");
        } finally {
          get().setIsLoading(false);
        }
      },

      // Add/Update/Delete functions for Firestore
      addContentDraft: async (draft) => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          const newDraftRef = doc(collection(db, `artifacts/${__app_id}/users/${userId}/contentDrafts`));
          await setDoc(newDraftRef, { ...draft, userId, generatedAt: new Date(), isPosted: false });
          get().fetchContentDrafts(); // Refresh drafts
        } catch (e) {
          console.error("Error adding content draft:", e);
          get().setError("Failed to save content draft.");
        } finally {
          get().setIsLoading(false);
        }
      },

      addPostToHistory: async (post) => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          const newPostRef = doc(collection(db, `artifacts/${__app_id}/users/${userId}/postHistory`));
          await setDoc(newPostRef, { ...post, userId, postedAt: new Date() });
          get().fetchPostHistory(); // Refresh history
        } catch (e) {
          console.error("Error adding post to history:", e);
          get().setError("Failed to record post history.");
        } finally {
          get().setIsLoading(false);
        }
      },

      addConnectedAccount: async (platform, accessToken, refreshToken) => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          const newAccountRef = doc(collection(db, `artifacts/${__app_id}/users/${userId}/connectedAccounts`), platform);
          await setDoc(newAccountRef, {
            userId,
            platform,
            accessToken: "simulated_token", // In a real app, this would be encrypted
            refreshToken: "simulated_refresh_token", // In a real app, this would be encrypted
            connectedAt: new Date(),
          });
          get().fetchConnectedAccounts(); // Refresh accounts
        } catch (e) {
          console.error(`Error connecting ${platform} account:`, e);
          get().setError(`Failed to connect ${platform} account.`);
        } finally {
          get().setIsLoading(false);
        }
      },

      disconnectAccount: async (accountId) => {
        const userId = get().userId;
        if (!userId) return;
        get().setIsLoading(true);
        try {
          // Firestore doesn't have a direct deleteDoc on collection, so we need the full path
          // For simplicity, we'll assume accountId is the platform name for this simulation
          await setDoc(doc(db, `artifacts/${__app_id}/users/${userId}/connectedAccounts`, accountId), {}, { merge: true }); // Simulate removal by clearing data, or ideally use deleteDoc
          console.log(`Disconnected ${accountId}`);
          get().fetchConnectedAccounts();
        } catch (e) {
          console.error(`Error disconnecting account ${accountId}:`, e);
          get().setError(`Failed to disconnect ${accountId}.`);
        } finally {
          get().setIsLoading(false);
        }
      },
    }),
    {
      name: 'jake-social-hub-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ user: state.user, userId: state.userId }), // Persist only user info
    }
  )
);

// --- Root Application Component ---
function App() {
  const { user, userId, setUser, fetchUserProfile, fetchConnectedAccounts, fetchContentDrafts, fetchPostHistory, currentView, setCurrentView, isLoading, error, setError } = useAppStore();
  const { toast } = useToast();

  // Firebase Authentication setup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile();
        await fetchConnectedAccounts();
        await fetchContentDrafts();
        await fetchPostHistory();
      } else {
        // Fallback to anonymous login if no initial token
        if (typeof __initial_auth_token === 'undefined') {
          signInAnonymously(auth)
            .then(() => {
              toast({ title: "Signed in anonymously.", description: "You are logged in with a temporary account." });
            })
            .catch((err) => {
              console.error("Anonymous sign-in failed:", err);
              setError("Failed to sign in. Please check your Firebase configuration.");
              toast({
                title: "Authentication Error",
                description: "Could not sign in anonymously. Check console for details.",
                variant: "destructive",
              });
            });
        } else {
          // Use custom token if provided
          signInWithCustomToken(auth, __initial_auth_token)
            .then(() => {
              toast({ title: "Signed in with custom token." });
            })
            .catch((err) => {
              console.error("Custom token sign-in failed:", err);
              setError("Failed to sign in with custom token. Please check your token or Firebase config.");
              toast({
                title: "Authentication Error",
                description: "Could not sign in with custom token. Check console for details.",
                variant: "destructive",
              });
            });
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [setUser, fetchUserProfile, fetchConnectedAccounts, fetchContentDrafts, fetchPostHistory, setError, toast]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      useAppStore.setState({ userProfile: null, connectedAccounts: [], contentDrafts: [], postHistory: [] }); // Clear state
      toast({ title: "Logged out.", description: "You have successfully logged out." });
    } catch (e) {
      console.error("Error logging out:", e);
      setError("Failed to log out.");
      toast({
        title: "Logout Error",
        description: "Could not log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">Loading application...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4">
        <h1 className="text-2xl font-bold mb-4">Application Error</h1>
        <p className="text-center">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reload App
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-center">
            <Sparkles className="mr-2" /> Jake's Social Hub
          </h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <Button
                  variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-lg"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <Home className="mr-2 h-5 w-5" /> Dashboard
                </Button>
              </li>
              <li>
                <Button
                  variant={currentView === 'generate' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-lg"
                  onClick={() => setCurrentView('generate')}
                >
                  <Sparkles className="mr-2 h-5 w-5" /> Generate Content
                </Button>
              </li>
              <li>
                <Button
                  variant={currentView === 'accounts' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-lg"
                  onClick={() => setCurrentView('accounts')}
                >
                  <Settings className="mr-2 h-5 w-5" /> Social Accounts
                </Button>
              </li>
              <li>
                <Button
                  variant={currentView === 'history' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-lg"
                  onClick={() => setCurrentView('history')}
                >
                  <History className="mr-2 h-5 w-5" /> Post History
                </Button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-8">
          {userId && (
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              User ID: <span className="font-mono break-all">{userId}</span>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full justify-start text-lg text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'generate' && <ContentGeneration />}
        {currentView === 'accounts' && <SocialAccountManagement />}
        {currentView === 'history' && <PostHistory />}
      </main>
    </div>
  );
}

export default App;

// --- Dashboard Component ---
function Dashboard() {
  const { userProfile, userId, contentDrafts, postHistory } = useAppStore();
  const recentPosts = postHistory.slice(-5).reverse(); // Get last 5 posts

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">Welcome, {userProfile?.name || 'Jake Woodworth'}!</CardTitle>
          <CardDescription>Your centralized hub for social media automation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userId && (
            <p className="text-gray-600 dark:text-gray-300">
              Your current user ID: <span className="font-mono break-all font-semibold">{userId}</span>
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="text-xl">Generated Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">{contentDrafts.length}</p>
                <CardDescription>Total content drafts available for review.</CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/30">
              <CardHeader>
                <CardTitle className="text-xl">Successful Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-700 dark:text-green-300">{postHistory.filter(p => p.status === 'success').length}</p>
                <CardDescription>Content successfully posted to social platforms.</CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-900/30">
              <CardHeader>
                <CardTitle className="text-xl">Last Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentPosts.length > 0 ? (
                  <p className="text-xl font-semibold text-yellow-700 dark:text-yellow-300">
                    {new Date(recentPosts[0].postedAt.seconds * 1000).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xl text-yellow-700 dark:text-yellow-300">No recent posts</p>
                )}
                <CardDescription>Most recent content posting time.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Recent Post History</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 ? (
            <ScrollArea className="h-60 rounded-md border p-4">
              <ul className="space-y-3">
                {recentPosts.map((post, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    {post.platform === 'instagram' && <img src="https://img.icons8.com/color/48/instagram-new.png" alt="Instagram" className="w-6 h-6" />}
                    {post.platform === 'linkedin' && <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" className="w-6 h-6" />}
                    {post.platform === 'twitter' && <img src="https://img.icons8.com/color/48/twitterx.png" alt="X (Twitter)" className="w-6 h-6" />}
                    <div className="flex-1">
                      <p className="font-medium">{post.platform} - {new Date(post.postedAt.seconds * 1000).toLocaleString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{post.postedContent?.text || post.postedContent?.caption || 'No content snippet'}</p>
                    </div>
                    {post.status === 'success' && (
                      <span className="text-green-500 text-sm">✅ Success</span>
                    )}
                    {post.status === 'failed' && (
                      <span className="text-red-500 text-sm">❌ Failed</span>
                    )}
                    {post.postUrl && (
                      <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                        View Post
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No recent post history to display. Generate and post some content!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Content Generation Module ---
function ContentGeneration() {
  const { userProfile, isLoading, setIsLoading, addContentDraft, setError } = useAppStore();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [quickThought, setQuickThought] = useState('');
  const [draftMode, setDraftMode] = useState(true);
  const [generatedContent, setGeneratedContent] = useState(null); // { instagramPosts: [], linkedinPosts: [], twitterPosts: [] }
  const { toast } = useToast();

  const jakeBrandGuidelines = userProfile?.brandGuidelines || {
    name: "Jake Woodworth",
    agency: "Woodworth AI",
    dualFacets: {
      entrepreneur: {
        focus: "Jake's journey, mindset, leadership, adaptability, philosophy, broader business insights, growth strategies, personal development, the 'why' behind building things.",
        tone: "Personal, reflective, inspiring, philosophical, passionate, authentic.",
      },
      aiExpert: {
        focus: "Practical AI applications, automation strategies, solving specific business inefficiencies with AI, industry trends in AI, tangible benefits of AI solutions.",
        tone: "Authoritative, practical, problem-solving, results-oriented, clear, concise.",
      },
    },
    keyDifferentiators: "Young, driven, innately adaptable (military kid background), multifaceted thinker (philosopher, writer, psychologist, leader), authentic journey (AI interest grew organically), competitive drive ('will win,' 'love doing it').",
    corePhilosophy: "If there's time to be saved and resources to be conserved, why not?",
    overallTone: "Confident, approachable, enthusiastic, transparent, insightful, action-oriented.",
    mandatoryInclusion: "Always aim to provide value and maintain authenticity.",
  };

  // Simulated LLM API Call
  const simulateGeminiContentGeneration = async (transcriptOrThought, type) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(Math.random() * 2000 + 1000, resolve));

      let instagramPosts = [];
      let linkedinPosts = [];
      let twitterPosts = [];

      const basePrompt = `
        You are an AI assistant tasked with generating social media content for Jake Woodworth.
        Jake's Brand Identity and Voice Guidelines:
        Name: ${jakeBrandGuidelines.name}
        Agency: ${jakeBrandGuidelines.agency}
        Dual Facets:
          Entrepreneur (Primary): Focus on ${jakeBrandGuidelines.dualFacets.entrepreneur.focus} Tone: ${jakeBrandGuidelines.dualFacets.entrepreneur.tone}
          AI Expert (Secondary, via Woodworth AI): Focus on ${jakeBrandGuidelines.dualFacets.aiExpert.focus} Tone: ${jakeBrandGuidelines.dualFacets.aiExpert.tone}
        Key Differentiators: ${jakeBrandGuidelines.keyDifferentiators}
        Core Philosophy: "${jakeBrandGuidelines.corePhilosophy}"
        Overall Tone: ${jakeBrandGuidelines.overallTone}
        Mandatory Inclusion: ${jakeBrandGuidelines.mandatoryInclusion}

        Content Source: ${type === 'youtube' ? 'YouTube Video Transcript' : 'Direct Quick Thought'}
        Source Text: "${transcriptOrThought}"

        Based on the source text and Jake's brand guidelines, generate engaging social media content for Instagram, LinkedIn, and X (Twitter).
        Ensure the content reflects Jake's dual brand facets where appropriate, and always aims to provide value and maintain authenticity.

        For YouTube videos:
        - Identify "journey" and "value" segments in the transcript.
        - Suggest 1-3 Instagram captions. For Instagram, suggest a conceptual clip URL (e.g., "youtube_clip_1_timestamp_range").
        - Generate 2-3 LinkedIn posts (longer, professional, insightful).
        - Generate 3-5 concise X (Twitter) tweets (short, impactful, use relevant hashtags).

        For Quick X (Twitter) Thought:
        - Generate 1-2 tweets based on the thought.

        Format the output as a JSON object with the following structure:
        {
          "instagramPosts": [
            { "clipUrl": "simulated_youtube_clip_url_1", "caption": "Instagram caption 1" },
            { "clipUrl": "simulated_youtube_clip_url_2", "caption": "Instagram caption 2" }
          ],
          "linkedinPosts": [
            { "text": "LinkedIn post 1" },
            { "text": "LinkedIn post 2" }
          ],
          "twitterPosts": [
            { "text": "Tweet 1" },
            { "text": "Tweet 2" },
            { "text": "Tweet 3" }
          ]
        }
      `;

      // Mock Gemini API call
      // In a real application:
      // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GEMINI_API_KEY', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ contents: [{ parts: [{ text: basePrompt }] }] }),
      // });
      // const data = await response.json();
      // const generatedText = data.candidates[0].content.parts[0].text;

      let mockGeneratedContent = {};

      if (type === 'youtube') {
        mockGeneratedContent = {
          instagramPosts: [
            { clipUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?start=10&end=30", caption: `💡 New insights from my latest YouTube! This clip captures my journey from an idea to execution. #EntrepreneurJourney #AIforBusiness\n\n${transcriptOrThought.substring(0, 50)}...` },
            { clipUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?start=60&end=90", caption: `Thrilled to share this snippet on leveraging AI for positive-sum outcomes. The philosophy behind Woodworth AI. #AIEfficiency #TechInnovation\n\n${transcriptOrThought.substring(50, 100)}...` },
          ],
          linkedinPosts: [
            { text: `My recent YouTube video delves into the core of adaptability in the entrepreneurial journey, a lesson I learned early on as a military kid. We explore how embracing change and having a multifaceted approach can truly drive growth. This isn't just about business; it's about a mindset that says, "If there's time to be saved and resources to be conserved, why not?" Check out the full video for deeper insights on building with purpose. #Entrepreneurship #Leadership #AIExpert #WoodworthAI #PersonalDevelopment\n\nBased on: ${transcriptOrThought.substring(0, 150)}...` },
            { text: `In the latest Woodworth AI content, I break down practical AI applications that are solving real-world business inefficiencies. From automating mundane tasks to strategic decision-making, AI is a powerful tool for positive-sum games. It's about taking the confusion out of technology and putting actionable results in your hands. This resonates with my core philosophy: continuous improvement through smart application. #AITrends #BusinessEfficiency #Innovation #GrowthMindset\n\nBased on: ${transcriptOrThought.substring(150, 300)}...` },
            { text: `The essence of true entrepreneurial success lies not just in what you build, but *why* you build it. My latest YouTube discusses the authentic journey behind Woodworth AI, driven by a competitive spirit and a genuine love for creating value. It's about tackling challenges head-on and always striving to provide tangible benefits. Discover how this philosophy shapes every project we undertake. #StartupLife #AIStrategy #Authenticity #Driven\n\nBased on: ${transcriptOrThought.substring(300, 450)}...` },
          ],
          twitterPosts: [
            { text: `Just dropped a new YouTube video! 🚀 Diving deep into the #EntrepreneurJourney and why adaptability is key. My core philosophy: "If there's time to be saved & resources to be conserved, why not?" #JakeWoodworth` },
            { text: `Leveraging #AI to solve real business inefficiencies. My latest video explores practical applications. Take confusion out of tech! #WoodworthAI #AIEfficiency` },
            { text: `From military kid to entrepreneur: my journey is about continuous growth & multifaceted thinking. Check out the new insights on YouTube! #Leadership #Innovation` },
            { text: `The 'why' behind building Woodworth AI: it's about competitive drive & providing value. Always authentic, always impactful. #AIExpert #StartupLife` },
            { text: `New video alert! 💡 Exploring positive-sum games with #AI. Saving time & conserving resources is the name of the game. What are your thoughts? #TechTrends` },
          ]
        };
      } else { // quickThought
        mockGeneratedContent = {
          instagramPosts: [], // Not applicable for quick thought
          linkedinPosts: [], // Not applicable for quick thought
          twitterPosts: [
            { text: `${quickThought} #JakeWoodworth #AIThought` },
            { text: `Expanding on a quick thought: "${quickThought.substring(0, 50)}..." My take on [relevant topic from thought]. #WoodworthAI` },
          ]
        };
      }

      setGeneratedContent(mockGeneratedContent);
      toast({ title: "Content Generated!", description: "Review the AI-generated drafts below." });

    } catch (e) {
      console.error("Error generating content:", e);
      setError("Failed to generate content. Please try again.");
      toast({
        title: "Generation Error",
        description: "Failed to generate content. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFromYouTube = () => {
    if (!youtubeUrl) {
      toast({ title: "Input Required", description: "Please enter a YouTube video URL." });
      return;
    }
    // Simulate YouTube transcript fetch
    const simulatedTranscript = `This is a simulated transcript for the YouTube video ${youtubeUrl}. It talks about Jake's entrepreneurial journey, how he built Woodworth AI, his philosophy on using AI for efficiency, and the importance of authenticity in business. He mentions his background as a military kid fostering adaptability and his competitive drive to succeed. The video highlights tangible benefits of AI solutions and the value of positive-sum games in technology.`;
    simulateGeminiContentGeneration(simulatedTranscript, 'youtube');
  };

  const handlePostQuickThought = () => {
    if (!quickThought) {
      toast({ title: "Input Required", description: "Please enter a quick X (Twitter) thought." });
      return;
    }
    simulateGeminiContentGeneration(quickThought, 'quick_thought');
  };

  const handleConfirmAndPost = async () => {
    const { addPostToHistory, addContentDraft } = useAppStore();
    setIsLoading(true);
    setError(null);
    try {
      const draftToSave = {
        sourceUrl: youtubeUrl || null,
        sourceThought: quickThought || null,
        instagramPosts: generatedContent?.instagramPosts?.map(p => ({ ...p, status: 'draft' })) || [],
        linkedinPosts: generatedContent?.linkedinPosts?.map(p => ({ ...p, status: 'draft' })) || [],
        twitterPosts: generatedContent?.twitterPosts?.map(p => ({ ...p, status: 'draft' })) || [],
      };
      // For simplicity, we'll generate a dummy ID for the draft before saving
      const dummyDraftId = `draft_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await addContentDraft({ id: dummyDraftId, ...draftToSave }); // Save initial draft

      // Simulate posting to social media APIs
      const postingPromises = [];

      if (generatedContent?.instagramPosts?.length > 0) {
        postingPromises.push(
          Promise.all(generatedContent.instagramPosts.map(async (post) => {
            await new Promise(resolve => setTimeout(500, resolve)); // Simulate API call
            const status = Math.random() > 0.1 ? 'success' : 'failed'; // 90% success rate
            const postUrl = status === 'success' ? `https://instagram.com/p/${Math.random().toString(36).substring(7)}` : null;
            await addPostToHistory({
              platform: 'instagram',
              originalDraftId: dummyDraftId, // This would be the actual Firestore ID of the saved draft
              postedContent: { clipUrl: post.clipUrl, caption: post.caption },
              postUrl,
              status,
            });
            return { platform: 'instagram', status, postUrl };
          }))
        );
      }

      if (generatedContent?.linkedinPosts?.length > 0) {
        postingPromises.push(
          Promise.all(generatedContent.linkedinPosts.map(async (post) => {
            await new Promise(resolve => setTimeout(500, resolve));
            const status = Math.random() > 0.1 ? 'success' : 'failed';
            const postUrl = status === 'success' ? `https://linkedin.com/feed/update/${Math.random().toString(36).substring(7)}` : null;
            await addPostToHistory({
              platform: 'linkedin',
              originalDraftId: dummyDraftId,
              postedContent: { text: post.text },
              postUrl,
              status,
            });
            return { platform: 'linkedin', status, postUrl };
          }))
        );
      }

      if (generatedContent?.twitterPosts?.length > 0) {
        postingPromises.push(
          Promise.all(generatedContent.twitterPosts.map(async (post) => {
            await new Promise(resolve => setTimeout(500, resolve));
            const status = Math.random() > 0.1 ? 'success' : 'failed';
            const postUrl = status === 'success' ? `https://twitter.com/jake_woodworth/status/${Math.random().toString(36).substring(7)}` : null;
            await addPostToHistory({
              platform: 'twitter',
              originalDraftId: dummyDraftId,
              postedContent: { text: post.text },
              postUrl,
              status,
            });
            return { platform: 'twitter', status, postUrl };
          }))
        );
      }

      await Promise.all(postingPromises.flat());
      setGeneratedContent(null); // Clear content after posting
      setYoutubeUrl('');
      setQuickThought('');
      toast({ title: "Content Posted!", description: "Content has been sent to selected social platforms (simulated)." });

    } catch (e) {
      console.error("Error posting content:", e);
      setError("Failed to post content. Please check connected accounts and try again.");
      toast({
        title: "Posting Error",
        description: "Failed to post content. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Generate New Content</CardTitle>
          <CardDescription>Leverage AI to create engaging posts for your social media.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="youtube-url">YouTube Video URL/ID</Label>
            <Input
              id="youtube-url"
              type="text"
              placeholder="e.g., https://www.youtube.com/watch?v=VIDEO_ID or VIDEO_ID"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="draft-mode"
                checked={draftMode}
                onCheckedChange={setDraftMode}
                disabled={isLoading}
              />
              <Label htmlFor="draft-mode">Draft Mode (Review before posting)</Label>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={handleGenerateFromYouTube}
              disabled={isLoading || !youtubeUrl}
            >
              {isLoading && youtubeUrl ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Content
            </Button>
          </div>

          <Separator className="my-8" />

          <div className="space-y-4">
            <Label htmlFor="quick-thought">Quick X (Twitter) Thought</Label>
            <Textarea
              id="quick-thought"
              placeholder="Enter a short thought for a quick tweet..."
              value={quickThought}
              onChange={(e) => setQuickThought(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={handlePostQuickThought}
              disabled={isLoading || !quickThought}
            >
              {isLoading && quickThought ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate & {draftMode ? "Review" : "Post"} X (Twitter) Thought
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="bg-white dark:bg-gray-800 shadow-lg text-center p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">AI is generating your content...</p>
          <CardDescription>This might take a few moments.</CardDescription>
        </Card>
      )}

      {generatedContent && (
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Generated Content Preview</CardTitle>
            <CardDescription>Review and edit your AI-generated drafts. Confirm to post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {generatedContent.instagramPosts && generatedContent.instagramPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <img src="https://img.icons8.com/color/48/instagram-new.png" alt="Instagram" className="w-7 h-7 mr-2" />
                  Instagram Posts
                </h3>
                {generatedContent.instagramPosts.map((post, index) => (
                  <Card key={index} className="bg-gray-50 dark:bg-gray-850 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Suggested Clip: {post.clipUrl}</p>
                    <Label htmlFor={`instagram-caption-${index}`}>Caption</Label>
                    <Textarea
                      id={`instagram-caption-${index}`}
                      value={post.caption}
                      onChange={(e) => {
                        const updatedContent = { ...generatedContent };
                        updatedContent.instagramPosts[index].caption = e.target.value;
                        setGeneratedContent(updatedContent);
                      }}
                      rows={4}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      *Actual video clipping/embedding requires advanced backend processing. For now, AI suggests timestamps and generates captions.
                    </p>
                  </Card>
                ))}
              </div>
            )}

            {generatedContent.linkedinPosts && generatedContent.linkedinPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" className="w-7 h-7 mr-2" />
                  LinkedIn Posts
                </h3>
                {generatedContent.linkedinPosts.map((post, index) => (
                  <Card key={index} className="bg-gray-50 dark:bg-gray-850 p-4">
                    <Label htmlFor={`linkedin-text-${index}`}>Post Content</Label>
                    <Textarea
                      id={`linkedin-text-${index}`}
                      value={post.text}
                      onChange={(e) => {
                        const updatedContent = { ...generatedContent };
                        updatedContent.linkedinPosts[index].text = e.target.value;
                        setGeneratedContent(updatedContent);
                      }}
                      rows={6}
                      className="mt-1"
                    />
                  </Card>
                ))}
              </div>
            )}

            {generatedContent.twitterPosts && generatedContent.twitterPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <img src="https://img.icons8.com/color/48/twitterx.png" alt="X (Twitter)" className="w-7 h-7 mr-2" />
                  X (Twitter) Tweets
                </h3>
                {generatedContent.twitterPosts.map((post, index) => (
                  <Card key={index} className="bg-gray-50 dark:bg-gray-850 p-4">
                    <Label htmlFor={`twitter-text-${index}`}>Tweet Content</Label>
                    <Textarea
                      id={`twitter-text-${index}`}
                      value={post.text}
                      onChange={(e) => {
                        const updatedContent = { ...generatedContent };
                        updatedContent.twitterPosts[index].text = e.target.value;
                        setGeneratedContent(updatedContent);
                      }}
                      rows={3}
                      className="mt-1"
                    />
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!draftMode && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                onClick={handleConfirmAndPost}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm & Post All Generated Content
              </Button>
            )}
            {draftMode && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={() => {
                  // In draft mode, we just save the draft.
                  // The "Confirm & Post" button will be active if draftMode is false.
                  // For now, let's just clear the generated content after reviewing in draft mode.
                  addContentDraft({
                    sourceUrl: youtubeUrl || null,
                    sourceThought: quickThought || null,
                    instagramPosts: generatedContent?.instagramPosts?.map(p => ({ ...p, status: 'draft' })) || [],
                    linkedinPosts: generatedContent?.linkedinPosts?.map(p => ({ ...p, status: 'draft' })) || [],
                    twitterPosts: generatedContent?.twitterPosts?.map(p => ({ ...p, status: 'draft' })) || [],
                  });
                  setGeneratedContent(null);
                  setYoutubeUrl('');
                  setQuickThought('');
                  toast({ title: "Draft Saved!", description: "Your generated content has been saved as a draft." });
                }}
                disabled={isLoading}
              >
                Save as Draft
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

// --- Social Account Management Component ---
function SocialAccountManagement() {
  const { connectedAccounts, isLoading, addConnectedAccount, disconnectAccount, setError } = useAppStore();
  const { toast } = useToast();

  const handleConnectAccount = async (platform) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(1500, resolve)); // Simulate OAuth process
      await addConnectedAccount(platform, 'simulated_access_token', 'simulated_refresh_token');
      toast({ title: "Account Connected!", description: `${platform} account simulated connection successful.` });
    } catch (e) {
      console.error(`Error simulating ${platform} connection:`, e);
      setError(`Failed to connect ${platform} account.`);
      toast({
        title: "Connection Error",
        description: `Could not connect ${platform} account.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectAccount = async (platform) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(1000, resolve)); // Simulate disconnection
      await disconnectAccount(platform); // Assuming platform name is docId
      toast({ title: "Account Disconnected!", description: `${platform} account disconnected.` });
    } catch (e) {
      console.error(`Error simulating ${platform} disconnection:`, e);
      setError(`Failed to disconnect ${platform} account.`);
      toast({
        title: "Disconnection Error",
        description: `Could not disconnect ${platform} account.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = (platformName) => {
    return connectedAccounts.some(account => account.platform === platformName);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Manage Social Accounts</CardTitle>
          <CardDescription>Connect and disconnect your social media profiles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['instagram', 'linkedin', 'twitter'].map((platform) => (
              <Card key={platform} className="flex flex-col items-center p-6 shadow-sm dark:bg-gray-850">
                <img
                  src={`https://img.icons8.com/color/96/${platform === 'twitter' ? 'twitterx' : platform}.png`}
                  alt={platform}
                  className="w-16 h-16 mb-4"
                />
                <h3 className="text-xl font-semibold capitalize mb-2">{platform}</h3>
                {isConnected(platform) ? (
                  <>
                    <p className="text-green-500 font-medium mb-4">Connected</p>
                    <Button
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => handleDisconnectAccount(platform)}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-red-500 font-medium mb-4">Disconnected</p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={() => handleConnectAccount(platform)}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Connect
                    </Button>
                  </>
                )}
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            *Actual OAuth flows for connecting accounts are complex backend tasks and are simulated for this demonstration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Post History Component ---
function PostHistory() {
  const { postHistory, isLoading, setError } = useAppStore();
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD

  const filteredHistory = postHistory.filter(post => {
    const platformMatch = filterPlatform === 'all' || post.platform === filterPlatform;
    const dateMatch = filterDate === '' || new Date(post.postedAt.seconds * 1000).toISOString().split('T')[0] === filterDate;
    return platformMatch && dateMatch;
  }).sort((a, b) => b.postedAt.seconds - a.postedAt.seconds); // Sort by most recent first

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Post History</CardTitle>
          <CardDescription>View a log of all your past social media posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="platform-filter">Filter by Platform</Label>
              <select
                id="platform-filter"
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 mt-1"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">X (Twitter)</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="date-filter">Filter by Date</Label>
              <Input
                id="date-filter"
                type="date"
                className="mt-1"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Loading history...</span>
            </div>
          ) : filteredHistory.length > 0 ? (
            <ScrollArea className="h-[500px] rounded-md border p-4">
              <ul className="space-y-4">
                {filteredHistory.map((post) => (
                  <li key={post.id} className="flex flex-col md:flex-row items-start md:items-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-850 shadow-sm">
                    <div className="flex items-center mb-2 md:mb-0 md:mr-4 w-full md:w-auto">
                      {post.platform === 'instagram' && <img src="https://img.icons8.com/color/48/instagram-new.png" alt="Instagram" className="w-8 h-8 mr-2" />}
                      {post.platform === 'linkedin' && <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" className="w-8 h-8 mr-2" />}
                      {post.platform === 'twitter' && <img src="https://img.icons8.com/color/48/twitterx.png" alt="X (Twitter)" className="w-8 h-8 mr-2" />}
                      <span className="font-semibold capitalize text-lg">{post.platform}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.postedAt.seconds * 1000).toLocaleString()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {post.postedContent?.text || post.postedContent?.caption || 'No content available'}
                      </p>
                      <div className="flex items-center space-x-2 text-sm mt-2">
                        {post.status === 'success' ? (
                          <span className="text-green-600 flex items-center">
                            ✅ Success
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            ❌ Failed
                          </span>
                        )}
                        {post.postUrl && (
                          <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View Post
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 p-8">No post history found for the selected filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
