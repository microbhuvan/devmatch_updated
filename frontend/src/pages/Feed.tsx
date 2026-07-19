import { useEffect, useState, useCallback } from "react";
import { FaGhost } from "react-icons/fa";

import FeedCard from "../components/feed/FeedCard";
import FeedCardSkeleton from "../components/feed/FeedCardSkeleton";

import { useToast } from "../hooks/useToast";
import { getFeed } from "../services/feed.service";
import { sendConnectionRequest, ignoreUser } from "../services/request.service";

import type { FeedUser } from "../types/feed.types";

const Feed = () => {
  const [users, setUsers] = useState<FeedUser[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | false>(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toast = useToast();

  const fetchFeed = useCallback(async (pageNumber: number) => {
    if (!hasMore && pageNumber > 1) return;

    setLoading(true);
    try {
      const data = await getFeed(pageNumber);
      if (data.users.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prev) => {
          // Prevent adding duplicate users
          const existingIds = new Set(prev.map(u => u._id));
          const newUsers = data.users.filter(u => !existingIds.has(u._id));
          return [...prev, ...newUsers];
        });
      }
    } catch (err) {
      toast.error("Unable to load developers. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [hasMore, toast]);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  const showNextUser = () => {
    setIsAnimating(true);
    // Wait for the animation to finish before removing the user from the state
    setTimeout(() => {
      setUsers((prev) => prev.slice(1));
      setIsAnimating(false);
      
      // Load more users if we are near the end of the current list
      if (users.length <= 3 && hasMore && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFeed(nextPage);
      }
    }, 300); // Duration should match the CSS transition
  };

  const handleConnect = async (userId: string) => {
    setActionLoading(userId);
    try {
      await sendConnectionRequest(userId);
      toast.success("Request sent!");
      showNextUser();
    } catch (err) {
      toast.error("Unable to send the request. Please try again.");
      setActionLoading(false);
    }
    // No finally block here, loading is cleared in showNextUser after animation
  };

  const handleIgnore = async (userId: string) => {
    setActionLoading(userId);
    try {
      await ignoreUser(userId);
      showNextUser();
    } catch (err) {
      toast.error("Unable to ignore this developer. Please try again.");
      setActionLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="relative mx-auto mt-4 max-w-xl sm:mt-10 h-[600px]">
        <FeedCardSkeleton />
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 pt-20 text-center">
        <FaGhost className="text-7xl text-base-content/20" />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">No More Developers</h2>
          <p className="text-base-content/60">
            You've reached the end of the list. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-4 h-[600px] max-w-xl sm:mt-10">
      {users.slice(0, 3).reverse().map((user, index) => {
          const isTopCard = index === users.slice(0, 3).length - 1;
          return (
            <div
              key={user._id}
              className="absolute inset-0 transition-all duration-300 ease-in-out"
              style={{
                transform: `scale(${1 - (users.length - 1 - index) * 0.05}) translateY(${(users.length - 1 - index) * -10}px)`,
                zIndex: index,
                opacity: isAnimating && isTopCard ? 0 : 1,
                transformOrigin: 'center bottom',
              }}
            >
              <FeedCard
                user={user}
                onConnect={handleConnect}
                onIgnore={handleIgnore}
                loading={actionLoading === user._id}
                isTopCard={isTopCard}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Feed;

