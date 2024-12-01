// AdminNavigation.js
import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Import UI components
import AdminNavigationUI from './ui/AdminNavigationUI';

// Admin Components
import AdminPage from '../admin/AdminPage';
import AdminItem from '../admin/AdminItemView';
import ProfileDashboard from '../users/ProfileDashboard'
import ProfileGuest from '../users/GuestProfile';
import BlockedUsersList from '../users/BlockedUserList';
import Settings from '../users/Settings';
import TransactionsList from '../admin/TransactionList';
import ProductDetail from '../seller/ProductDetails'
import Overview from '../admin/OverView';
import UsersList from '../admin/UserList';
import VerifiedUsersList from '../admin/VerifiedUserList';
import SellerProfile from '../admin/SellerProfile';
import ClientProfile from '../admin/ClientProfile';
import BannedUsers from '../admin/BannedUsers';
import ReportedUsers from '../admin/ReportedUsers';
import AllItems from '../admin/AllItems';
import HiddenItems from '../admin/HiddenItem';
import ProductsScreen from '../admin/ProductScreen';
import ServicesScreen from '../admin/ServicesScreen';
import EligibleBanning from '../admin/EligibleBanning';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Determines if the tab bar should be visible
export const getIsTabBarShown = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;
  const hideTabBarRoutes = ['ShoppingBuy', 'ProfileDashboard']; // Separate elements
  return !hideTabBarRoutes.includes(routeName);
};


// Client stack navigator for shopping screens
function AdminViewStack() {
  return (
    <Stack.Navigator initialRouteName="AdminPage">
      <Stack.Screen name="AdminPage" component={AdminPage} options={{ headerShown: false }}/>
      <Stack.Screen name="AdminItem" component={AdminItem} options={{ headerShown: false }}/>
      <Stack.Screen name="TransactionList" component={TransactionsList} options={{ headerShown: false }}/>
      <Stack.Screen name="OverView" component={Overview} options={{ headerShown: false }}/>
      <Stack.Screen name="UserList" component={UsersList} options={{ headerShown: false }}/>   
      <Stack.Screen name="ProfileDashboard" component={ProfileDashboard} options={{ headerShown: false }}/>   
      <Stack.Screen name="VerifiedUserList" component={VerifiedUsersList} options={{ headerShown: false }}/>   
      <Stack.Screen name="SellerProfile" component={SellerProfile} options={{ headerShown: false }}/>
      <Stack.Screen name="ClientProfile" component={ClientProfile} options={{ headerShown: false }}/>
      <Stack.Screen name="BannedUsers" component={BannedUsers} options={{ headerShown: false }}/>
      <Stack.Screen name="ReportedUsers" component={ReportedUsers} options={{ headerShown: false }}/>
      <Stack.Screen name="AllItems" component={AllItems} options={{ headerShown: false }}/>
      <Stack.Screen name="HiddenItems" component={HiddenItems} options={{ headerShown: false }}/>
      <Stack.Screen name="ProductScreen" component={ProductsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="EligibleBanning" component={EligibleBanning} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function ClientNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileGuest" component={ProfileGuest} options={{ headerShown: false }}/>
      <Stack.Screen name="ProfileDashboard" component={ProfileDashboard} options={{ headerShown: false }}/>
      <Stack.Screen name="AdminItem" component={AdminItem} options={{ headerShown: false }}/>
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
    </Stack.Navigator>
  );
}

// Client bottom tab navigator
export function AdminTabs({ setUser, setUserRole }) {
  return (
    <AdminNavigationUI
      setUser={setUser}
      setUserRole={setUserRole}
      AdminViewStack={AdminViewStack}
      getIsTabBarShown={getIsTabBarShown}
      ClientNavigation={ClientNavigation}
      SettingsNavigation={SettingsNavigation}
    />
  );
}
