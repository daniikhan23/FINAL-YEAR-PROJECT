import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth();

/**
 * Context for auth state and user information.
 *
 * @interface AuthContextType
 * @property {User | null} currentUser - The current authenticated Firebase user or null if not authenticated.
 * @property {boolean} loading - Indicates whether the authentication state is being loaded.
 */
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

/**
 * Creates an AuthContext with a default state of not authenticated and loading.
 */
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

/**
 * Custom hook to use the auth context.
 *
 * @returns {AuthContextType} The current user and loading state.
 */
export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication-related data to its child components, managing the current user state
 * and the authentication loading state. It subscribes to Firebase auth state changes to update
 * these states accordingly.
 *
 * @param {ReactNode} children - Child components that can access the auth context.
 * @returns {JSX.Element} A context provider wrapping its children, providing them with the current user and loading state.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once the user is fetched
    });
    return unsubscribe; // Unsubscribe on cleanup
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
