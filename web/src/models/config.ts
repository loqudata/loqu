import { createModel } from "@rematch/core";
import type { RootModel } from "./index";

export interface AppConfig {
  serverUrl?: string | null;
}

export const config = createModel<RootModel>()({
  state: { serverUrl: null } as AppConfig,
  reducers: {
    set(state, payload) {
      return { ...state, ...payload };
    },
  },
});
