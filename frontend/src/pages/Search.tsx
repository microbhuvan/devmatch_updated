import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCrown, FaGhost } from "react-icons/fa";

import type { RootState } from "../redux/store";
import type { SearchUser } from "../types/search.types";

import { searchDevelopers } from "../services/search.service";
import { sendConnectionRequest, ignoreUser } from "../services/request.service";

import SearchCard from "../components/search/SearchCard";
import { useToast } from "../hooks/useToast";

const Search = () => {
  const toast = useToast();

  const { user } = useSelector((state: RootState) => state.auth);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | false>(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const data = await searchDevelopers(searchQuery);

      setResults(data.profiles);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Unable to search developers.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(trimmedQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleConnect = async (userId: string) => {
    try {
      setActionLoading(userId);

      await sendConnectionRequest(userId);

      setResults((prev) => prev.filter((user) => user.userId._id !== userId));

      toast.success("Request sent!");
    } catch {
      toast.error("Unable to send request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleIgnore = async (userId: string) => {
    try {
      setActionLoading(userId);

      await ignoreUser(userId);

      setResults((prev) => prev.filter((user) => user.userId._id !== userId));
    } catch {
      toast.error("Unable to ignore developer.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!user?.isPremium) {
    return (
      <div className="mx-auto mt-8 max-w-2xl px-4 sm:mt-12">
        <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center shadow-xl">
          <FaCrown className="mx-auto mb-5 text-6xl text-warning" />

          <h1 className="text-3xl font-bold">Premium Developer Search</h1>

          <p className="mt-4 text-base-content/70">
            Instantly search developers by username or skills.
          </p>

          <div className="mt-8 space-y-3 text-left">
            <p>✓ Search by username</p>
            <p>✓ Search by skills</p>
            <p>✓ Find developers instantly</p>
          </div>

          <Link to="/upgrade" className="btn btn-primary mt-8">
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-6xl px-4 sm:mt-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Search Developers</h1>

        <p className="mt-2 text-base-content/60">
          Search developers by username or skills.
        </p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          value={query}
          placeholder="Search by username or skill..."
          className="input input-bordered w-full"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <FaGhost className="text-6xl text-base-content/20" />

          <h2 className="text-2xl font-bold">No developers found</h2>

          <p className="text-base-content/60">
            Try searching with another username or skill.
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((developer) => (
          <SearchCard
            key={developer._id}
            user={developer}
            onConnect={handleConnect}
            onIgnore={handleIgnore}
            loading={actionLoading === developer.userId._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
