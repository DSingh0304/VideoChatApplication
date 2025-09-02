import { useParams } from "react-router-dom";
import { useState , useEffect  } from "react";
import { getStreamToken } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from "stream-chat-react"
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const ChatPage = () => {

  const {id:targetUserId} = useParams();
  
  const [chatClient , setChatClient] = useState<any | null>(null);
  const [channel , setChannel] = useState<any | null>(null);
  const [loading , setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const {data:tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser // donot run this query function until the auth user is available
  })

  useEffect(() => {
    const initChat = async () => {
      if(!tokenData?.token || !authUser?.user) return;
      try {
      console.log("Initialising stream chat client...");
      const client = StreamChat.getInstance(STREAM_API_KEY);

      await client.connectUser({
        id: authUser.user._id,
        name: authUser.user.fullName,
        image: authUser.user.profilePic,
      }, tokenData.token)

      const channelId = [authUser.user._id, targetUserId || ""].sort().join("-"); //sorting the channel is very important

      const currChannel = client.channel("messaging", channelId , {
        members: [authUser.user._id, targetUserId],
      });

      await currChannel.watch();
      setChatClient(client);
      setChannel(currChannel);
      
    } catch (error) {
       console.error("Error initializing chat:",error);
       toast.error("Could not connect to chat. Please try again");
    }
    finally{
      setLoading(false);
    }
    };

    // call the initializer
    initChat();

    // cleanup on unmount or dependency change
    return () => {
      if (chatClient) {
        // disconnect user when leaving chat
        chatClient.disconnectUser().catch(() => {});
        setChatClient(null);
      }
    };
  },[tokenData , authUser , targetUserId]);

  if(loading || !chatClient || !channel) return <ChatLoader />

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handle={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage