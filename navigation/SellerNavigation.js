// SellerNavigation.js
import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Import UI components
import SellerNavigationUI from './ui/SellerNavigationUI';

// Seller Components
import SellerPosting from '../seller/SellerPosting';
import ServiceProduct from '../seller/ServiceProduct';
import ServiceProductCreation from '../seller/ServiceProductCreate';
import ProductDetail from '../seller/ProductDetails';
import ProfileDashboard from '../users/ProfileDashboard'
import ProfileGuest from '../users/GuestProfile';
import BlockedUsersList from '../users/BlockedUserList';
import Settings from '../users/Settings';
import SimpleNotification from '../users/NotifcationSeller';
import CreationLoadingScreen from '../seller-src/CreationLoadingScreen';
import PendingCreation from '../seller/PendingCreation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const getIsTabBarShown = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;
  const hideTabBarRoutes = ['ShoppingBuy', 'CreationLoadingScreen'];
  return !hideTabBarRoutes.includes(routeName);
};

// Seller stack navigator for posting screens
function ProductPostingStack() {
  return (
    <Stack.Navigator initialRouteName="SellerPosting">
      <Stack.Screen name="SellerPosting" component={SellerPosting} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceProduct" component={ServiceProduct} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceProductCreation" component={ServiceProductCreation} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="CreationLoadingScreen" component={CreationLoadingScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PendingCreation" component={PendingCreation} options={{ headerShown: false }}/>
      <Stack.Screen name="NotificationSeller" component={SimpleNotification} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function SellerNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileGuest" component={ProfileGuest} options={{ headerShown: false }}/>
      <Stack.Screen name="ProfileDashboard" component={ProfileDashboard} options={{ headerShown: false }}/>
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }}/>
     <Stack.Screen 
        name="NotificationSeller" 
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
      <Stack.Screen name="NotificationSeller" component={SimpleNotification} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function NotificationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SimpleNotification" component={SimpleNotification} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Seller bottom tab navigator
export function SellerTabs({ setUser, setUserRole }) {
  return (
    <SellerNavigationUI
      setUser={setUser}
      setUserRole={setUserRole}
      ProductPostingStack={ProductPostingStack}
      getIsTabBarShown={getIsTabBarShown}
      SellerNavigation={SellerNavigation}
      SettingsNavigation={SettingsNavigation}
      NotificationStack={NotificationStack}
    />
  );
}
