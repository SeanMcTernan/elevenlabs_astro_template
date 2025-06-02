import { Conversation } from '@elevenlabs/client';

type ConversationEvents = {
  onConnect: (props: { conversationId: string }) => void;
  onDisconnect: () => void;
  onError: (message: string, context?: any) => void;
  onModeChange: (props: { mode: string }) => void;
};

let activeConversation: Conversation | null = null;

async function getSignedUrl() {
  const response = await fetch('/api/agent');
  if (!response.ok) {
    throw new Error(`Failed to get signed URL: ${response.statusText}`);
  }
  const { signedUrl } = await response.json();
  return signedUrl;
}

export async function setupConversation(
  startButton: HTMLButtonElement,
  overlayLogo: HTMLDivElement,
  connectionStatus: HTMLSpanElement,
  events: ConversationEvents
) {
  const stopConversation = async () => {
    if (activeConversation) {
      console.log('%c🛑 Stopping Conversation', 'color: #f44336; font-size: 16px;');
      await activeConversation.endSession();
      activeConversation = null;
      startButton.textContent = 'Start Conversation';
      startButton.disabled = false;
      overlayLogo.classList.remove('speaking', 'idle');
    }
  };

  const startConversation = async () => {
    try {
      startButton.disabled = true;
      startButton.textContent = 'Starting...';
      console.log('%c🎤 Starting Conversation', 'color: #4CAF50; font-size: 16px');

      // Get signed URL from our serverless function
      const signedUrl = await getSignedUrl();
      console.log('Got signed URL:', signedUrl);

      // Initialize and start the conversation
      activeConversation = await Conversation.startSession({
        signedUrl,
        onConnect: (props) => {
          console.log('%c🔗 Connected', 'color: #4CAF50; font-size: 16px;');
          connectionStatus.textContent = 'Connected';
          connectionStatus.className = 'badge connected';
          events.onConnect(props);
        },
        onDisconnect: () => {
          console.log('%c🔴 Disconnected', 'color: #f44336; font-size: 16px;');
          connectionStatus.textContent = 'Disconnected';
          connectionStatus.className = 'badge disconnected';
          startButton.textContent = 'Start Conversation';
          events.onDisconnect();
        },
        onError: (message: string, context?: any) => {
          console.error('Conversation error:', message, context);
          connectionStatus.textContent = 'Error';
          connectionStatus.className = 'badge error';
          startButton.textContent = 'Start Conversation';
          startButton.disabled = false;
          overlayLogo.classList.remove('speaking', 'idle');
          events.onError(message, context);
        },
        onModeChange: (props) => {
          if (!props || !props.mode) {
            console.error('Invalid mode object:', props);
            return;
          }

          if (props.mode === 'speaking') {
            overlayLogo.classList.remove('idle');
            overlayLogo.classList.add('speaking');
          } else {
            overlayLogo.classList.remove('speaking');
            overlayLogo.classList.add('idle');
          }

          events.onModeChange(props);
        },
      });

      console.log('%c🎵 Audio Stream Started', 'color: #9C27B0; font-size: 16px;');
      console.log('%c🎵 Using CSS animations for speaking state', 'color: #9C27B0; font-size: 16px;');

      startButton.textContent = 'Stop Conversation';
      startButton.disabled = false;
      overlayLogo.classList.add('idle');
    } catch (error) {
      console.error('Failed to start conversation:', error);
      startButton.textContent = 'Start Conversation';
      startButton.disabled = false;
      await stopConversation();
    }
  };

  // Add click event listeners
  const handleStartButtonClick = () => {
    if (activeConversation) {
      stopConversation();
    } else {
      startConversation();
    }
  };

  const handleOverlayClick = (event: MouseEvent) => {
    // Stop conversation when clicking the overlay background, not the logo
    if (event.target instanceof Element && !event.target.closest('.overlay-logo')) {
      stopConversation();
    }
  };

  startButton.addEventListener('click', handleStartButtonClick);
  document.getElementById('conversationOverlay')?.addEventListener('click', handleOverlayClick);

  // Return cleanup function
  return () => {
    startButton.removeEventListener('click', handleStartButtonClick);
    document.getElementById('conversationOverlay')?.removeEventListener('click', handleOverlayClick);
    stopConversation();
  };
}
