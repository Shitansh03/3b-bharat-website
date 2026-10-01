import { createContext, useContext, useState, useEffect } from "react";
import {
  handleLoginSuccess,
  handleLogout as clearAuthLocalStorage,
  isRoadRegistered as checkRoadRegistered,
  isBridgeRegistered as checkBridgeRegistered,
  getActiveEuhId as fetchActiveEuhId,
  getActiveModule as fetchActiveModule,
  setActiveModule as updateActiveModule,
  getUserProfiles,
  getRegisteredTypes,
  AUTH_KEYS,
} from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [roadEuhId, setRoadEuhId] = useState("");
  const [bridgeEuhId, setBridgeEuhId] = useState("");
  const [activeModule, setActiveModuleState] = useState("road");
  const [profiles, setProfiles] = useState({});
  const [registeredTypes, setRegisteredTypesState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth state on mount
  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(AUTH_KEYS.USER) ||
        localStorage.getItem(AUTH_KEYS.LEGACY_AUTH);
      const savedToken =
        localStorage.getItem(AUTH_KEYS.TOKEN) ||
        localStorage.getItem(AUTH_KEYS.LEGACY_TOKEN);

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setRoadEuhId(localStorage.getItem(AUTH_KEYS.ROAD_EUH_ID) || "");
        setBridgeEuhId(localStorage.getItem(AUTH_KEYS.BRIDGE_EUH_ID) || "");
        setActiveModuleState(fetchActiveModule());
        setProfiles(getUserProfiles());
        setRegisteredTypesState(getRegisteredTypes());
      }
    } catch (err) {
      console.warn("[Auth] Failed to load saved auth state:", err.message);
      clearAuthLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, authToken, fullResult = null) => {
    // Flexible handler supporting:
    // 1. login(userData, authToken, fullResult)
    // 2. login(fullResult)
    let payload = fullResult;
    let currentUser = userData;
    let currentToken = authToken;

    if (userData && !authToken && (userData.token || userData.data)) {
      payload = userData;
      const inner = userData.data?.data || userData.data || userData;
      currentUser = inner.user;
      currentToken = inner.token;
    } else if (!payload) {
      payload = {
        user: userData,
        token: authToken,
        road_euh_id: userData?.road_euh_id || userData?.euh_id || "",
        bridge_euh_id: userData?.bridge_euh_id || "",
        profiles: userData?.profiles || {},
        registered_types: userData?.registered_types || [],
        active_module: userData?.active_module,
      };
    }

    const savedResult = handleLoginSuccess(payload);

    setUser(currentUser);
    setToken(currentToken);
    setRoadEuhId(savedResult?.road_euh_id || localStorage.getItem(AUTH_KEYS.ROAD_EUH_ID) || "");
    setBridgeEuhId(savedResult?.bridge_euh_id || localStorage.getItem(AUTH_KEYS.BRIDGE_EUH_ID) || "");
    setActiveModuleState(localStorage.getItem(AUTH_KEYS.ACTIVE_MODULE) || "road");
    setProfiles(getUserProfiles());
    setRegisteredTypesState(getRegisteredTypes());
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRoadEuhId("");
    setBridgeEuhId("");
    setActiveModuleState("road");
    setProfiles({});
    setRegisteredTypesState([]);
    clearAuthLocalStorage();
  };

  const switchActiveModule = (moduleName) => {
    updateActiveModule(moduleName);
    setActiveModuleState(moduleName);
  };

  /**
   * Get saved app_token for device-binding (sent on subsequent logins)
   */
  const getSavedAppToken = () => {
    return (
      localStorage.getItem(AUTH_KEYS.TOKEN) ||
      localStorage.getItem(AUTH_KEYS.LEGACY_TOKEN) ||
      null
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        roadEuhId,
        bridgeEuhId,
        activeModule,
        profiles,
        registeredTypes,
        isRoadRegistered: checkRoadRegistered,
        isBridgeRegistered: checkBridgeRegistered,
        getActiveEuhId: fetchActiveEuhId,
        setActiveModule: switchActiveModule,
        login,
        logout,
        getSavedAppToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

