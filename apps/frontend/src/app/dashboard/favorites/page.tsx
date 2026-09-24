'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import FavoriteButton from '@/components/ticket-listing-mobile/mobile/FavoriteButton';
import { useFavoritesStore } from '@/core/store/data/favorites.store';
import { STUB_EVENTS } from '@/lib/mockData/events';

export default function FavoritesPage() {
  const { savedListingIds, removeSaved } = useFavoritesStore();

  // TODO: replace STUB_EVENTS with Apollo query → public.ticket_listings (Hasura)
  const savedListings = STUB_EVENTS.filter((listing) =>
    savedListingIds.includes(listing.id),
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved listings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ticket listings you are watching
        </p>
      </div>

      {savedListings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No saved listings yet</p>
          <p className="text-sm mt-1">
            Save a ticket listing by clicking the heart icon to keep an eye on
            its price.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedListings.map((listing) => (
            <div
              key={listing.id}
              className="border rounded-xl p-4 bg-card space-y-3"
            >
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <Ticket className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/rent/${listing.id}`}
                    className="font-semibold hover:underline"
                  >
                    {listing.name}
                  </Link>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {listing.address}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    {format(new Date(listing.eventDate), 'MMM d, yyyy · h:mm a')}
                  </p>
                  <p className="text-sm text-primary font-semibold mt-1">
                    {listing.price.toLocaleString()} USDC
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Face value {listing.faceValue.toLocaleString()} USDC ·{' '}
                    {listing.section} · {listing.seat}
                  </p>
                </div>

                <FavoriteButton
                  isLiked
                  showCount={false}
                  onLike={() => removeSaved(listing.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
