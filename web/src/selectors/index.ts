import { AppConfig } from "models/config";
import { RootState } from "../store/store";

export * from "./data";
export * from "./shelf";

export const selectConfig = (state: RootState): AppConfig => state.config;
