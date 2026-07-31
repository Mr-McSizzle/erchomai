import { useAmbientAudio } from "@/components/erchomai/useAmbientAudio";

/** Mounts the global Web Audio ambience once, for every route. */
export function AudioLayer() {
  useAmbientAudio(true);
  return null;
}
