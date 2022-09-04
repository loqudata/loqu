import Tracker from "@openreplay/tracker/cjs";
import { getUserID } from "utils/userId";
import trackerRedux from "@openreplay/tracker-redux/cjs";

import { usePostHog } from "hooks/usePosthog";
import { useEffect } from "react";

// Based on https://github.com/thundermiracle/openreplay-examples/blob/main/examples/with-next-dynamic-import/components/OpenReplayTracker.tsx
const tracker = new Tracker({
  projectKey: process.env.NEXT_PUBLIC_OPENREPLAY_API_KEY,
  // __DISABLE_SECURE_MODE: true,
  onStart: () => {
    tracker.setUserID(getUserID());
  },
});

export const openReplayMiddleware = tracker.use(trackerRedux({}));

export const AnalyticsContainer: React.FC = ({ children }) => {
  usePostHog(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
    api_host: "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.opt_out_capturing();
      posthog.identify(getUserID());
    },
  });

  useEffect(() => {
    if (!(process.env.NODE_ENV === "development")) {
      tracker.start();
    }
  }, []);

  return <>{children}</>;
};
