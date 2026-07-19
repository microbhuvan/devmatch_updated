import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaUsers } from "react-icons/fa";

import ConnectionCard from "../components/connection/ConnectionCard";
import ConnectionCardSkeleton from "../components/connection/ConnectionCardSkeleton";

import { getConnections } from "../services/request.service";
import { useToast } from "../hooks/useToast";

import type { Connection } from "../types/request.types";
import type { RootState } from "../redux/store";

const Connections = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConnections();
      setConnections(data.connections);
    } catch {
      toast.error("Unable to load connections. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold">My Connections</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <ConnectionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">My Connections</h1>

      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-base-300 py-20 text-center">
          <FaUsers className="text-7xl text-base-content/20" />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">No Connections Yet</h2>
            <p className="text-base-content/60">
              Connections you make will appear here. Find developers in the
              Feed!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection._id}
              connection={connection}
              currentUserId={user?.id ?? ""}
              onRemove={(connectionId) => {
                setConnections((prev) =>
                  prev.filter((connection) => connection._id !== connectionId),
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
