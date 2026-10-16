import ProtectedRoute from "../components/ProtectedRoute";
import ProfileLayout from "../layouts/ProfileLayout";
import Chat from "../components/chat/Chat";

const ChatRoutes = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "chat/:conversationId",
        element: <Chat />,
      }
    ],
  },
];

export default ChatRoutes;