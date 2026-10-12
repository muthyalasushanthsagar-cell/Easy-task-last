import React from 'react';
import { BrowserRouter, Routes, Route, useOutletContext } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import AllTasksPage from './pages/AllTasksPage';
import TodayTasksPage from './pages/TodayTasksPage';
import UpcomingTasksPage from './pages/UpcomingTasksPage';
import CompletedTasksPage from './pages/CompletedTasksPage';
import GroceryPage from './pages/GroceryPage';
import SettingsPage from './pages/SettingsPage';

function WrappedPage({ Component }) {
  const context = useOutletContext();
  return <Component {...context} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<WrappedPage Component={DashboardPage} />} />
          <Route path="tasks" element={<WrappedPage Component={AllTasksPage} />} />
          <Route path="today" element={<WrappedPage Component={TodayTasksPage} />} />
          <Route path="upcoming" element={<WrappedPage Component={UpcomingTasksPage} />} />
          <Route path="completed" element={<WrappedPage Component={CompletedTasksPage} />} />
          <Route path="grocery" element={<WrappedPage Component={GroceryPage} />} />
          <Route path="settings" element={<WrappedPage Component={SettingsPage} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
