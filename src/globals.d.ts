// YouTube API types
declare namespace YT {
  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    events?: {
      onReady?: (event: OnReadyEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    };
    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      modestbranding?: 0 | 1;
      rel?: 0 | 1;
      showinfo?: 0 | 1;
      iv_load_policy?: 1 | 3;
      fs?: 0 | 1;
    };
  }

  interface OnReadyEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    data: number;
    target: Player;
  }

  interface OnErrorEvent {
    data: number;
    target: Player;
  }

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    getAvailablePlaybackRates(): number[];
    setSize(width: number, height: number): void;
    getPlaylist(): string[];
    getPlaylistIndex(): number;
    destroy(): void;
  }

  const PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };

  namespace KindCount {
    enum ERROR {
      InvalidParam,
      HTML5PlayerRequired,
      VideoNotFound,
      EmbeddingNotAllowed,
    }
  }
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}
