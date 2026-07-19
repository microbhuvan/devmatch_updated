import { useEffect, useState, useCallback } from "react";
import { FaPaperPlane } from "react-icons/fa";

import SentRequestCard from "../components/request/SentRequestCard";
import SentRequestCardSkeleton from "../components/request/SentRequestCardSkeleton";

import { getSentRequests, cancelRequest } from "../services/request.service";
import { useToast } from "../hooks/useToast";
import type { SentRequest } from "../types/request.types";

const SentRequests = () => {
  const [requests, setRequests] = useState<SentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | false>(false);

  const toast = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSentRequests();
      setRequests(response.requests);
    } catch (err) {
      toast.error("Could not load sent requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const removeRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r._id !== requestId));
  };

  const handleCancel = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await cancelRequest(requestId);
      toast.success("Request cancelled.");
      removeRequest(requestId);
    } catch (err) {
      toast.error("Failed to cancel request. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <h1 className="mb-6 text-3xl font-bold">Sent Requests</h1>
        {[...Array(3)].map((_, i) => (
          <SentRequestCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Sent Requests</h1>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-base-300 py-20 text-center">
          <FaPaperPlane className="text-7xl text-base-content/20" />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">No Sent Requests</h2>
            <p className="text-base-content/60">
              When you send a connection request, it will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <SentRequestCard
              key={request._id}
              request={request}
              onCancel={handleCancel}
              loading={actionLoading === request._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SentRequests;
