// ClientNavigation.js
import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Import UI components
import ClientNavigationUI from '../navigation/ui/ClientNavigationUI';

// Client Components
import ClientShop from '../client/Shop';
import ShoppingBuy from '../client/ShoppingBuy';
import ClientHistory from '../client/ClientHistory';
import ProfileDashboard from '../users/ProfileDashboard'
import ProfileGuest from '../users/GuestProfile';
import BlockedUsersList from '../users/BlockedUserList';
import Settings from '../users/Settings';
import ProductReview from '../users/ProuctReview';
import SimpleNotification from '../users/NotifcationClient';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Determines if the tab bar should be visible
export const getIsTabBarShown = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;
  const hideTabBarRoutes = ['ShoppingBuy', 'ProfileDashboard']; // Separate elements
  return !hideTabBarRoutes.includes(routeName);
};


// Client stack navigator for shopping screens
function ClientShopStack() {
  return (
    <Stack.Navigator initialRouteName="ClientShop">
      <Stack.Screen name="ClientShop" component={ClientShop} options={{ headerShown: false }} />
      <Stack.Screen name="ShoppingBuy" component={ShoppingBuy} options={{ headerShown: false }} />
      <Stack.Screen name="ClientHistory" component={ClientHistory} options={{ headerShown: false }} />
      <Stack.Screen name="ProductReview" component={ProductReview} options={{ headerShown: false }}/>
      <Stack.Screen name="NotificationClient" component={SimpleNotification} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function ClientNavigation({ userEmail }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileGuest" component={ProfileGuest} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileDashboard" component={ProfileDashboard} options={{ headerShown: false }} />
      <Stack.Screen name="ShoppingBuy" component={ShoppingBuy} options={{ headerShown: false }} />
      <Stack.Screen 
        name="NotificationClient" 
        options={{ headerShown: false }}
      >
        {props => <SimpleNotification {...props} userEmail={userEmail} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


function SettingsNavigation({ setUser, setUserRole }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" options={{ headerShown: false }}>
        {props => (
          <Settings
            {...props}
            setUser={setUser} 
            setUserRole={setUserRole}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BlockedUserList" component={BlockedUsersList} options={{ headerShown: false }}/>
      <Stack.Screen name="NotificationClient" component={SimpleNotification} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

// Client bottom tab navigator
export function ClientTabs({ setUser, setUserRole }) {
  return (
    <ClientNavigationUI
      setUser={setUser}
      setUserRole={setUserRole}
      ClientShopStack={ClientShopStack}
      getIsTabBarShown={getIsTabBarShown}
      ClientNavigation={ClientNavigation}
      SettingsNavigation={SettingsNavigation}
    />
  );
}
