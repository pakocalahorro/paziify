import { Authenticated, Refine } from "@refinedev/core";
import { ThemedLayout, ThemedTitle, useNotificationProvider, AuthPage } from "@refinedev/antd";
import { ConfigProvider, App as AntdApp } from "antd";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
  NavigateToResource,
  CatchAllNavigate,
} from "@refinedev/react-router";
import { liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import "./App.css";
import authProvider from "./providers/auth";
import { dataProvider } from "./providers/data";
import { supabaseClient } from "./providers/supabase-client";

import { AudiobookList } from "./pages/audiobooks/list";
import { AudiobookCreate } from "./pages/audiobooks/create";
import { AudiobookEdit } from "./pages/audiobooks/edit";
import { AcademyModuleList } from "./pages/academy/modules/list";
import { AcademyModuleCreate } from "./pages/academy/modules/create";
import { AcademyModuleEdit } from "./pages/academy/modules/edit";
import { AcademyLessonList } from "./pages/academy/lessons/list";
import { AcademyLessonCreate } from "./pages/academy/lessons/create";
import { AcademyLessonEdit } from "./pages/academy/lessons/edit";
import { MeditationSessionList } from "./pages/meditation-sessions/list";
import { MeditationSessionCreate } from "./pages/meditation-sessions/create";
import { MeditationSessionEdit } from "./pages/meditation-sessions/edit";
import { SoundscapeList } from "./pages/soundscapes/list";
import { SoundscapeCreate } from "./pages/soundscapes/create";
import { SoundscapeEdit } from "./pages/soundscapes/edit";
import { RealStoriesList } from "./pages/real-stories/list";
import { RealStoriesCreate } from "./pages/real-stories/create";
import { RealStoriesEdit } from "./pages/real-stories/edit";

import "@refinedev/antd/dist/reset.css";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <AntdApp>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider(supabaseClient)}
                authProvider={authProvider}
                routerProvider={routerProvider}
                notificationProvider={useNotificationProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "ZAFWSF-33aC0N-hQGpRf",
                }}
                resources={[
                  {
                    name: "audiobooks",
                    list: "/audiobooks",
                    create: "/audiobooks/create",
                    edit: "/audiobooks/edit/:id",
                    meta: { label: "Audiolibros" }
                  },
                  {
                    name: "meditation_sessions_content",
                    list: "/meditations",
                    create: "/meditations/create",
                    edit: "/meditations/edit/:id",
                    meta: {
                      label: "Meditaciones",
                      resource: "meditation_sessions_content"
                    }
                  },
                  {
                    name: "academy_modules",
                    list: "/academy/modules",
                    create: "/academy/modules/create",
                    edit: "/academy/modules/edit/:id",
                    meta: { label: "Cursos Academia" }
                  },
                  {
                    name: "academy_lessons",
                    list: "/academy/lessons",
                    create: "/academy/lessons/create",
                    edit: "/academy/lessons/edit/:id",
                    meta: { label: "Lecciones" }
                  },
                  {
                    name: "real_stories",
                    list: "/real-stories",
                    create: "/real-stories/create",
                    edit: "/real-stories/edit/:id",
                    meta: { label: "Relatos Reales" }
                  },
                  {
                    name: "soundscapes",
                    list: "/soundscapes",
                    create: "/soundscapes/create",
                    edit: "/soundscapes/edit/:id",
                    meta: { label: "Música Fondo" }
                  }
                ]}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route
                    element={
                      <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<AuthPage type="login" />} />
                    <Route path="/register" element={<AuthPage type="register" />} />
                    <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                  </Route>

                  {/* Protected Routes (Layout) */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout Title={({ collapsed }) => <ThemedTitle collapsed={collapsed} text="Paziify Admin" />}>
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route path="/audiobooks">
                      <Route index element={<AudiobookList />} />
                      <Route path="create" element={<AudiobookCreate />} />
                      <Route path="edit/:id" element={<AudiobookEdit />} />
                    </Route>
                    <Route path="/meditations">
                      <Route index element={<MeditationSessionList />} />
                      <Route path="create" element={<MeditationSessionCreate />} />
                      <Route path="edit/:id" element={<MeditationSessionEdit />} />
                    </Route>
                    <Route path="/academy/modules">
                      <Route index element={<AcademyModuleList />} />
                      <Route path="create" element={<AcademyModuleCreate />} />
                      <Route path="edit/:id" element={<AcademyModuleEdit />} />
                    </Route>
                    <Route path="/academy/lessons">
                      <Route index element={<AcademyLessonList />} />
                      <Route path="create" element={<AcademyLessonCreate />} />
                      <Route path="edit/:id" element={<AcademyLessonEdit />} />
                    </Route>
                    <Route path="/soundscapes">
                      <Route index element={<SoundscapeList />} />
                      <Route path="create" element={<SoundscapeCreate />} />
                      <Route path="edit/:id" element={<SoundscapeEdit />} />
                    </Route>
                    <Route path="/real-stories">
                      <Route index element={<RealStoriesList />} />
                      <Route path="create" element={<RealStoriesCreate />} />
                      <Route path="edit/:id" element={<RealStoriesEdit />} />
                    </Route>
                    <Route path="*" element={<AuthPage type="login" />} />
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineKbarProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
