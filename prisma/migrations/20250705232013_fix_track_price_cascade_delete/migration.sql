-- DropForeignKey
ALTER TABLE "track_prices" DROP CONSTRAINT "track_prices_trackId_fkey";

-- AddForeignKey
ALTER TABLE "track_prices" ADD CONSTRAINT "track_prices_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
