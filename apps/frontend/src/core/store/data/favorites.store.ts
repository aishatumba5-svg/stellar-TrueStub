import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { STUB_EVENTS } from "@/lib/mockData/events";

interface FavoritesGlobalStore {
  /** IDs of ticket listings the user has saved to watch. */
  savedListingIds: string[];
  isSaved: (listingId: string) => boolean;
  toggleSaved: (listingId: string) => void;
  removeSaved: (listingId: string) => void;
}

const FAVORITES_ACTIONS = {
  TOGGLE: "favorites/toggle",
  REMOVE: "favorites/remove",
} as const;

// TODO: replace the stub seed with the user's saved listings from Hasura
const INITIAL_SAVED_IDS = STUB_EVENTS.filter((event) => event.favorite).map(
  (event) => event.id,
);

export const useFavoritesStore = create<FavoritesGlobalStore>()(
  devtools(
    persist(
      (set, get) => ({
        savedListingIds: INITIAL_SAVED_IDS,

        isSaved: (listingId) => get().savedListingIds.includes(listingId),

        toggleSaved: (listingId) =>
          set(
            (state) => ({
              savedListingIds: state.savedListingIds.includes(listingId)
                ? state.savedListingIds.filter((id) => id !== listingId)
                : [...state.savedListingIds, listingId],
            }),
            false,
            FAVORITES_ACTIONS.TOGGLE,
          ),

        removeSaved: (listingId) =>
          set(
            (state) => ({
              savedListingIds: state.savedListingIds.filter(
                (id) => id !== listingId,
              ),
            }),
            false,
            FAVORITES_ACTIONS.REMOVE,
          ),
      }),
      { name: "truestub-saved-listings" },
    ),
    { name: "FavoritesStore" },
  ),
);
